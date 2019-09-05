using BusinessLogicLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using web_api.Models;

namespace web_api.Controllers
{
    public class UsersController : ApiController
    {
        // GET api/users
        public IHttpActionResult Get()
        {
            try
            {
                List<User> u = _BAL.GetUsers().ToList();
                return Ok(u);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }


        // GET api/users/1
        //[Route("{id:int:min(1)}", Name = "GetUserById")]
        public IHttpActionResult Get(int id)
        {
            try
            {
                User u = _BAL.GetUsers().SingleOrDefault(x => x.ID == id);
                if (u == null)
                    return Content(HttpStatusCode.NotFound,"user with id {" + id + "} was not found");

                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/users
        public IHttpActionResult PostRegister([FromBody]User user)
        {
            try
            {
                User u = _BAL.Register(user.Email, user.Password);

                return Created(new Uri(Request.RequestUri.AbsoluteUri + u.ID), u);
            }
            catch (Exception ex)
            {
                // maybe to write into a file log
                return BadRequest("user already exist -> " + ex.Message);
            }
        }

        // PUT api/users/1
        //public IHttpActionResult Put(int id, [FromBody]User user)
        //{
        //    try
        //    {
        //        User u = _BAL.UpdateUser(user.FirstName, user.LastName, user.Email, user.Password);
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //}
    }
}
