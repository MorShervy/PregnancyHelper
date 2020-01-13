using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class Contraction
    {
        public int UserID { get; set; }
        public int ContractionID { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Length { get; set; }
        public string TimeApart { get; set; }
        public string Date { get; set; }
    }
}
