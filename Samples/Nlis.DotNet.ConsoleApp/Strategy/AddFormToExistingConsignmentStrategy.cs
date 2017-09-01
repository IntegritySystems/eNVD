using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp.Strategy
{
    public class AddFormToExistingConsignmentStrategy : MenuOptionStrategy
    {
        private readonly ApiHelper _apiHelper;

        public AddFormToExistingConsignmentStrategy(ApiHelper apiHelper)
        {
            _apiHelper = apiHelper;
        }

        public override string Execute(IDictionary<string, string> args)
        {
            string program;
            string consignmentNumber;
            args.TryGetValue(nameof(program), out program);
            args.TryGetValue(nameof(consignmentNumber), out consignmentNumber);
            if(string.IsNullOrWhiteSpace(consignmentNumber))
                throw new ApplicationException($"value missing. key: {nameof(consignmentNumber)}");
            if (string.IsNullOrWhiteSpace(program))
                throw new ApplicationException($"value missing. key: {nameof(program)}");

            var consignmentResult = JToken.Parse(_apiHelper.GetConsignmentDetails(consignmentNumber)).SelectToken("Value");
            if(consignmentResult.SelectToken("..ConsignmentNumber") == null)
                throw new ApplicationException($"Unable to find consignment {consignmentNumber}");

            program = $"{string.Join(", ", consignmentResult.SelectToken("FormPrograms").Select(s => $"{s?.ToString()}"))},{program}";

            return _apiHelper.AddProgramToExistingConsignment(consignmentNumber, new {programs = program.Split(',').Select(s => s.Trim())});
        }

        public override void Print(JToken data)
        {
            Console.WriteLine(Environment.NewLine);
            Console.WriteLine($"Response: {data}");
        }
    }
}
