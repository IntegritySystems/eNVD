using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp.Strategy
{
    public class GetConsignmentDetailsStrategy : MenuOptionStrategy
    {
        private readonly ApiHelper _apiHelper;

        public GetConsignmentDetailsStrategy(ApiHelper apiHelper)
        {
            _apiHelper = apiHelper;
        }

        public override string Execute(IDictionary<string, string> args)
        {
            string consignmentNumber;
            args.TryGetValue("consignmentNumber", out consignmentNumber);
            return _apiHelper.GetConsignmentDetails(consignmentNumber);
        }

        public override void Print(JToken data)
        {
            var valueToken = data.SelectToken("Value");
            if(valueToken == null)
                throw new ApplicationException("Unable to parse response");

            DateTime createdAt;
            DateTime updatedAt;

            Console.WriteLine(Environment.NewLine);
            Console.WriteLine($"{"ConsignmentNumber : ",22}{valueToken.SelectToken("ConsignmentNumber")}");
            Console.WriteLine($"{"Status : ", 22}{valueToken.SelectToken("Status")}");

            Console.WriteLine(DateTime.TryParse(valueToken.SelectToken("CreatedAt")?.ToString(), out createdAt)
                ? $"{"Created At : ",22}{valueToken.SelectToken("CreatedAt"):yyyy-MM-dd hh:mm tt}"
                : $"{" ".PadLeft(32)}");

            Console.WriteLine(DateTime.TryParse(valueToken.SelectToken("UpdatedAt")?.ToString(), out updatedAt)
                ? $"{"Last Updated On : ",22}{valueToken.SelectToken("UpdatedAt"):yyyy-MM-dd hh:mm tt}"
                : $"{" ".PadLeft(32)}");

            Console.WriteLine($"{"The From PIC : ",22}{valueToken.SelectToken("PicFrom")}");
            Console.WriteLine($"{"The To PIC : ",22}{valueToken.SelectToken("PicTo")}");

            if(valueToken.SelectToken("FormPrograms") != null)
                Console.WriteLine($"{"Associated Programs : ",22}[ {string.Join(", ", valueToken.SelectToken("FormPrograms").Select(s => $" {s?.ToString()}"))} ]");

        }
    }
}
