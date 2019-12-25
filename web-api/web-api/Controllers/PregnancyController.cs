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





    }    
}

