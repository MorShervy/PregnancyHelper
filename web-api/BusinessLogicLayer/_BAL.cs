using DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using web_api.Models;

namespace BusinessLogicLayer
{
    public class _BAL
    {

        public static List<User> GetUsers()
        {
            List<User> users = null;
            DataTable res = _DAL.GetUsers();

            if (res == null)
                return null;

            foreach (DataRow row in res.Rows)
            {
                if (users == null)
                    users = new List<User>();

                users.Add(new User()
                {
                    ID = int.Parse(row["UserID"].ToString()),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    Email = row["Email"].ToString(),
                    Password = row["Password"].ToString(),
                    RegistrationDate = row["RegistrationDate"].ToString()
                });
            }
            return users;
        }

        public static User Register(string email, string password)
        {
            User u = null;
            DataTable res = _DAL.Register(email, password);

            if (res == null)
                return null;

            if (res.Columns.Count > 1)
            {
                u = new User()
                {
                    ID = int.Parse(res.Rows[0]["UserID"].ToString()),
                    FirstName = res.Rows[0]["FirstName"].ToString(),
                    LastName = res.Rows[0]["LastName"].ToString(),
                    Email = res.Rows[0]["Email"].ToString(),
                    Password = res.Rows[0]["Password"].ToString(),
                    RegistrationDate = res.Rows[0]["RegistrationDate"].ToString()
                };
                return u;
            }
            return null;
        }

        public static User Login(string email, string password)
        {
            List<User> users = GetUsers().ToList();

            foreach (var item in users)
            {
                if (item.Email.Equals(email) && item.Password.Equals(password))
                {
                    return item;
                }
            }
            return null;
        }
    }
}
