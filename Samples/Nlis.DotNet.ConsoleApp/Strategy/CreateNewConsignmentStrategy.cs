using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp.Strategy
{
    public class CreateNewConsignmentStrategy : MenuOptionStrategy
    {
        private readonly ApiHelper _apiHelper;

        public CreateNewConsignmentStrategy(ApiHelper apiHelper)
        {
            _apiHelper = apiHelper;
        }

        public override string Execute(IDictionary<string, string> args)
        {
            string species;
            string programs;
            string pic;
            string picName;
            string town;
            string state;

            args.TryGetValue(nameof(species), out species);
            args.TryGetValue(nameof(programs), out programs);
            args.TryGetValue(nameof(pic), out pic);
            args.TryGetValue(nameof(picName), out picName);
            args.TryGetValue(nameof(town), out town);
            args.TryGetValue(nameof(state), out state);

            if (string.IsNullOrWhiteSpace(species) || string.IsNullOrWhiteSpace(programs) ||
                string.IsNullOrWhiteSpace(picName) || string.IsNullOrWhiteSpace(town) || string.IsNullOrWhiteSpace(state))
                throw new ApplicationException("Unable to create Consignment: Information missing.");

            return _apiHelper.CreateNewConsignment(species, new { PicDetails = new { pic, picName, town, state }, programs = programs.Split(',') });
        }

        public override void Print(JToken data)
        {
            
            Console.WriteLine(Environment.NewLine);
            Console.WriteLine($"Response: {data.SelectToken("Value")}");
        }
    }
}