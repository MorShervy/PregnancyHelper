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
    [RoutePrefix("api/KickTracker")]
    public class KickTrackerController : ApiController
    {

        // GET api/kicktracker
        public IHttpActionResult Get()
        {
            try
            {
                List<KickTracker> list = _BAL.GetKickTrackers().ToList();
                return Ok(list);

            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        // GET api/kicktracker/1
        [Route("{id:int:min(1)}", Name = "GetKickTrackerByPregnantId")]
        public IHttpActionResult Get(int id)
        {
            try
            {
                List<KickTracker> list = _BAL.GetKickTrackers().ToList();
                List<KickTracker> kickTrackers = _BAL.GetKickTrackerByPregnantId(id, list);

                if (kickTrackers == null)
                {
                    var res = new { Message = "id {" + id + "} not exist" };
                    return Content(HttpStatusCode.NotFound, res);
                }
                return Ok(kickTrackers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertKickTracker")]
        public IHttpActionResult PostInsertKickTracker([FromBody]KickTracker k)
        {
            try
            {
                bool res = _BAL.InsertKickTracker(k.PregnantID, k.Date, k.Length, k.Time, k.Kicks);
                if(res)
                    return Created(new Uri(Url.Link("GetContractionByUserId", new { id = k.PregnantID })), res);
                var str = new  { Message = res.ToString() };
                return BadRequest(str.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DeleteKickTrackerByPregnantId")]
        public IHttpActionResult PostDeleteKickTrackerByPregnantId([FromBody]KickTracker k)
        {
            try
            {
                bool isDeleted = _BAL.DeleteKickTrackerByPregnantId(k.PregnantID);
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
