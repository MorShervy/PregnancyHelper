using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public static class _DAL
    {
        private static string conStr = null;
        private static bool local = false;
        private static SqlConnection Con = null;
        private static SqlDataAdapter _adtr = null;
        private static SqlCommand _command = null;

        static _DAL()
        {
            Configuration config = null;
            string codeBase = Assembly.GetExecutingAssembly().CodeBase;
            UriBuilder uri = new UriBuilder(codeBase);
            string path = Uri.UnescapeDataString(uri.Path);

            string exeConfigPath = path;
            try
            {
                config = ConfigurationManager.OpenExeConfiguration(exeConfigPath);
            }
            catch (Exception e)
            {
                //handle errror here.. means DLL has no sattelite configuration file.
                throw new Exception(e.Message);
            }

            if (config != null)
            {
                conStr = GetAppSetting(config, local ? "Local" : "LiveDNS");
            }

            Con = new SqlConnection(conStr);
        }

        static string GetAppSetting(Configuration config, string key)
        {
            KeyValueConfigurationElement element = config.AppSettings.Settings[key];
            if (element != null)
            {
                string value = element.Value;
                if (!string.IsNullOrEmpty(value))
                    return value;
            }
            return string.Empty;
        }

        public static DataTable GetUsers()
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("GetUsers", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _adtr = new SqlDataAdapter(_command);
                DataSet ds = new DataSet();
                _adtr.Fill(ds, "Users");

                if (ds.Tables["Users"].Rows.Count != 0)
                    return ds.Tables["Users"];
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }


        public static DataTable Register(string email, string password)
        {
            string RegistrationDate = DateTime.Now.ToString($"ddd, dd MMM yyy {DateTime.UtcNow.ToString("HH:mm:ss")}") + " GMT+0";
            try
            {
                Con.Open();
                _command = new SqlCommand("Register", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("Email", email));
                _command.Parameters.Add(new SqlParameter("Password", password));
                _command.Parameters.Add(new SqlParameter("RegistrationDate", RegistrationDate));


                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "User");
                if (ds.Tables["User"].Rows.Count != 0)
                    return ds.Tables["User"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable SendResetPasswordEmail(string email)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("ResetPassword", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("Email", email));

                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "ResetPassword");
                if (ds.Tables["ResetPassword"].Rows.Count != 0)
                    return ds.Tables["ResetPassword"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }
    }
}
