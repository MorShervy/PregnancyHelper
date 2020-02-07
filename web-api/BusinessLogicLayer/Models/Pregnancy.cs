using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace BusinessLogicLayer.Models
{
    public class Pregnancy 
    {
        public int PregnantID { get; set; }
        public int UserID { get; set; }
        public string DueDate { get; set; }
        public string LastMenstrualPeriod { get; set; }
        public string ChildName { get; set; }
        public string BirthDate { get; set; }
        public int Gender { get; set; }
        public string IsNewBorn { get; set; }
    }
}
