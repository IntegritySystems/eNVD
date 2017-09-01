using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp.Strategy
{
    /*
     * Examples:
     * 1. Get only submitted consignment by consignment number
     *          /consignments?consignmentNumber={consignmentNumber}&noDraft=true
     * 2. Get consignments including drafts
     *          /consignments?noDraft=false
     * 3. Get first 20 consignments including draft
     *          /consignments?noDraft=false&pageSize=20
     */
    public class GetConsignmentListStrategy : MenuOptionStrategy
    {
        private readonly ApiHelper _apiHelper;

        public GetConsignmentListStrategy(ApiHelper apiHelper)
        {
            _apiHelper = apiHelper;
        }
        
        public override string Execute(IDictionary<string, string> args)
        {
            string consignmentNumber = null;
            var noDraft = false;
            uint? pageSize = null;
            string pageToken = null;

            args.ToList().ForEach(pair =>
            {
                switch (pair.Key)
                {
                    case "consignmentNumber":
                        consignmentNumber = pair.Value;
                        break;
                    case "noDraft":
                        noDraft = bool.Parse(pair.Value);
                        break;
                    case "pageSize":
                        pageSize = uint.Parse(pair.Value);
                        break;
                    case "pageToken":
                        pageToken = pair.Value;
                        break;
                }
            });

            return _apiHelper.GetConsignments(consignmentNumber, noDraft, pageSize, pageToken);
        }

        public override void Print(JToken data)
        {
            Console.WriteLine($"{Environment.NewLine}{Environment.NewLine}{Environment.NewLine}");
            Console.WriteLine($"{string.Empty,-2}{"Id",-17}{"Species",-22}Created On");
            Console.WriteLine($"{string.Empty,-2}{string.Empty.PadLeft(14, '-'),-17}{string.Empty.PadLeft(16, '-'),-22}{string.Empty.PadLeft(18, '-'),-22}");
            
            var items = data.SelectToken("Value.Items");
            if (items == null)
            {
                Console.WriteLine("No Data to display");
                return;
            }

            items.ToList().ForEach(item =>
            {
                var consignmentNumber = item.SelectToken("ConsignmentNumber")?.ToString();
                var species = item.SelectToken("Species")?.ToString();
                DateTime createdOn;
                
                Console.Write($"{string.Empty,-2}{consignmentNumber,-17}");
                Console.Write($"{species,-22}");

                if (DateTime.TryParse(item.SelectToken("CreatedAt")?.ToString(), out createdOn))
                    Console.WriteLine($"{createdOn.ToLocalTime(),-22:yyyy-MM-dd hh:mmtt}");
                else
                    Console.WriteLine($"{" ".PadLeft(32)}");
            });
        }
    }    
}
