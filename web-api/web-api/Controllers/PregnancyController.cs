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

namespace web_api.Controllers
{
    [RoutePrefix("api/Pregnancy")]
    public class PregnancyController : ApiController
    {
        // GET api/pregnancy
        public IHttpActionResult Get()
        {
            try
            {
                List<Pregnancy> p = _BAL.GetPregnancies().ToList();
                return Ok(p);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        // GET api/pregnancy/1
        [Route("{id:int:min(1)}", Name = "GetPregnancyByUserId")]
        public IHttpActionResult Get(int id)
        {
            try
            {
                Pregnancy p = _BAL.GetPregnancies().SingleOrDefault(x => x.UserID == id);
                if (p == null)
                    return Content(HttpStatusCode.NotFound, "user with id {" + id + "} was not found");

                return Ok(p);
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

