using BusinessLogicLayer;
using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace web_api.Controllers
{
    [RoutePrefix("api/PregnancyAlbum")]
    public class PregnancyAlbumController : ApiController
    {
        // Get api/pregnancyAlbum
        public IHttpActionResult Get()
        {
            try
            {
                List<PregnancyAlbum> albums = _BAL.GetPregnanciesAlbums().ToList();
                return Ok(albums);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("{id:int:min(1)}", Name = "GetAlbumByPregnantId")]
        public IHttpActionResult Get(int id)
        {
            try
            {
                List<PregnancyAlbum> albums = _BAL.GetPregnanciesAlbums().ToList();
                List<PregnancyAlbum> pictures = _BAL.GetPregnancyAlbumByPregnantId(id, albums);

                if (pictures == null)
                    return Content(HttpStatusCode.NotFound, "album with pregnant id {" + id + "} was not found");
                return Ok(pictures);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("InsertPictureToPregnantAlbum")]
        public IHttpActionResult PostInsertPictureToPregnantAlbum([FromBody]PregnancyAlbum album)
        {
            try
            {
                PregnancyAlbum pregnantAlbum = _BAL.InsertPictureToPregnantAlbum(album.PregnantID, album.WeekID, album.PictureUri);
                return Created(new Uri(Url.Link("GetAlbumByPregnantId", new { id = album.PregnantID })), album);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // api/PregnancyAlbum/9
        [HttpPost]
        [Route("UpdatePictureInPregnancyAlbum")]
        public IHttpActionResult PostUpdatePictureInPregnancyAlbum([FromBody]PregnancyAlbum pic)
        {
            try
            {
                PregnancyAlbum picture = _BAL.UpdatePictureInPregnancyAlbum(pic.PregnantID, pic.WeekID, pic.PictureUri);

                if (picture == null)
                    return Content(HttpStatusCode.BadRequest, "something went really wrong! update picture to table has failed");
                return Ok(picture);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DeletPictureFromPregnancyAlbum")]
        public IHttpActionResult PostDeletPictureFromPregnancyAlbum([FromBody]PregnancyAlbum pic)
           
        {
            try
            {
                bool isDeleted = _BAL.DeletPictureFromPregnancyAlbum(pic.PregnantID, pic.WeekID);
                if (!isDeleted)
                    return Content(HttpStatusCode.BadRequest, isDeleted);
                return Ok(isDeleted);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("UploadPicture")]
        public Task<HttpResponseMessage> Post()
        {

            string outputForTest = "start---\r\n";
            List<string> savedFilePath = new List<string>();
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            string rootPath = HttpContext.Current.Server.MapPath("~/uploadFiles");
            // rootPath = C:\\Inetpub\\vhosts\\ruppinmobile.ac.il\\httpdocs\\site08\\uploadFiles

            var provider = new MultipartFileStreamProvider(rootPath);

            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<HttpResponseMessage>(t =>
                {
                    if (t.IsCanceled || t.IsFaulted)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }
                    foreach (MultipartFileData item in provider.FileData)
                    {
                        try
                        {
                            outputForTest += " ---item.Headers.ContentDisposition.FileName = " + item.Headers.ContentDisposition.FileName;
                            string name = item.Headers.ContentDisposition.FileName.Replace("\"", "");
                            outputForTest += " ---here2=" + name;

                            //need the guid because in react native in order to refresh an inamge it has to have a new name
                            string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + CreateDateTimeWithValidChars() + Path.GetExtension(name);
                            //string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + Guid.NewGuid() + Path.GetExtension(name);
                            //string newFileName = name + "" + Guid.NewGuid();
                            outputForTest += " ---here3" + newFileName;

                            //delete all files begining with the same name
                            //string[] names = Directory.GetFiles(rootPath);
                            //foreach (var fileName in names)
                            //{
                            //    if (Path.GetFileNameWithoutExtension(fileName).IndexOf(Path.GetFileNameWithoutExtension(name)) != -1)
                            //    {
                            //        File.Delete(fileName);
                            //    }
                            //}

                            //File.Move(item.LocalFileName, Path.Combine(rootPath, newFileName));
                            File.Copy(item.LocalFileName, Path.Combine(rootPath, newFileName), true);
                            File.Delete(item.LocalFileName);
                            outputForTest += " ---here4";

                            Uri baseuri = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, string.Empty));
                            outputForTest += " ---here5";
                            string fileRelativePath = "~/uploadFiles/" + newFileName;
                            outputForTest += " ---here6 imageName=" + fileRelativePath;
                            Uri fileFullPath = new Uri(baseuri, VirtualPathUtility.ToAbsolute(fileRelativePath));
                            outputForTest += " ---here7" + fileFullPath.ToString();
                            savedFilePath.Add(fileFullPath.ToString());


                        }
                        catch (Exception ex)
                        {
                            outputForTest += " ---excption=" + ex.Message;
                            string message = ex.Message;
                        }
                        //finally
                        //{
                        //    // todo mor
                        //    File.AppendAllText(HttpContext.Current.Server.MapPath("~/errLog.txt"), outputForTest);
                        //}
                    }

                    //return Request.CreateResponse(HttpStatusCode.Created, $"nirchen  + {savedFilePath[0].ToString()}  ! {provider.FileData.Count.ToString()}  !  {outputForTest} :)");
                    //return Request.CreateResponse(HttpStatusCode.Created, "nirchen");
                    return Request.CreateResponse(HttpStatusCode.Created, $"nirchen  + ! {provider.FileData.Count.ToString()}  !  {outputForTest} :)");
                });

            return task;
        }

        private string CreateDateTimeWithValidChars()
        {
            return DateTime.Now.ToString().Replace('/', '_').Replace(':', '-').Replace(' ', '_');
        }

    }
}
