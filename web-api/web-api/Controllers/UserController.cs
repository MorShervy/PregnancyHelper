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
    [RoutePrefix("api/User")]
    public class UserController : ApiController
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
        [Route("{id:int:min(1)}", Name = "GetUserById")]
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
        [HttpPost]
        [Route("Register")]
        public IHttpActionResult PostRegister([FromBody]User user)
        {
            try
            {
                User u = _BAL.Register(user.Email, user.Password);

                return Created(new Uri(Url.Link("GetUserById", new { id = u.ID })), u);
                //return Created(new Uri(Request.RequestUri.AbsoluteUri + u.ID), u);
            }
            catch (Exception ex)
            {
                // maybe to write into a file log
                return BadRequest("user already exist -> " + ex.Message);
            }
        }

        // POST api/users
        [HttpPost]
        [Route("Login")]
        public IHttpActionResult PostLogin([FromBody]User user)
        {
            try
            {
                User u = _BAL.Login(user.Email, user.Password);

                return Ok(u.ID);
            }
            catch (Exception ex)
            {
                // maybe to write into a file log
                return BadRequest("Incorrect username or password -> " + ex.Message);
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
