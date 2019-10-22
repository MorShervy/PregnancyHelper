using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class ResetPasswordRequest 
    {
        public string UniqueID { get; set; }
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }
}
