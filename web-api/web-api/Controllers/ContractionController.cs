using BusinessLogicLayer;
using BusinessLogicLayer.Models;
using System;

using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace web_api.Controllers
{
    [RoutePrefix("api/Contraction")]
    public class ContractionController : ApiController
    {


        public IHttpActionResult Get()
        {
            try
            {
                List<Contraction> list = _BAL.GetContractions().ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("{id:int:min(1)}", Name = "GetContractionByUserId")]
        public IHttpActionResult Get(int id)
        {
            try
            {
                List<Contraction> list = _BAL.GetContractions().ToList();
                List<Contraction> contractions = _BAL.GetContractionsByUserId(id, list);

                if (contractions == null)
                {
                    var res =new  { Message = "contraction with user id {" + id + "} was not found" };
                    return Content(HttpStatusCode.NotFound, res);
                }
                return Ok(contractions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertContraction")]
        public IHttpActionResult PostInsertContraction([FromBody]Contraction c)
        {
            try
            {
                Contraction contraction = _BAL.InsertContraction(c.UserID, c.StartTime, c.EndTime, c.Length, c.TimeApart,c.DateTime);
                return Created(new Uri(Url.Link("GetContractionByUserId", new { id = c.UserID })), c);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DeleteContractionByUserId")]
        public IHttpActionResult PostDeleteContractionByUserId([FromBody]Contraction c)
        {
            try
            {
                bool isDeleted = _BAL.DeleteContractionByUserId(c.UserID);
                if (!isDeleted)
                    return Content(HttpStatusCode.BadRequest, isDeleted);
                return Ok(isDeleted);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
