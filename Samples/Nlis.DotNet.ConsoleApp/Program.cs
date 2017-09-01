using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp
{
    class Program
    {
        private static readonly IList<string> MenuOptions = new List<string>
        {
            "Available Programs for Species",
            "Get List of Consignments",
            "Search by Consignment Number",
            "Get Consignment details by Consignment Number",
            "Create New Consignment",
            "Add Form to existing Consignment",
            "Exit"
        };
        
        static void Main()
        {
            var apiBaseUrl = ConfigurationManager.AppSettings["apiBaseUrl"];
            var authToken = new Authentication().RequestAuthenticationToken();

            if (string.IsNullOrWhiteSpace(apiBaseUrl) || string.IsNullOrWhiteSpace(authToken))
                throw new ApplicationException("Please setup Your API Base URL and the user Auth token before continuing.");

            int mainMenuSelection;
            var context = new MenuOptionContext(apiBaseUrl, authToken);
            do
            {
                mainMenuSelection = PrintMainMenu();
                if (mainMenuSelection == MenuOptions.Count)
                    break;

                context.StrategyIndex = mainMenuSelection;
                var parameters = new Dictionary<string, string>();
                switch (mainMenuSelection)
                {
                    case 1:
                        Console.Write("Enter species:");
                        parameters.Add("species", Console.ReadLine());
                        break;
                    case 2:
                        parameters.Add("pageSize", "10");
                        break;
                    case 3:
                        Console.Write("Enter consignment Number to search: ");
                        parameters.Add("consignmentNumber", Console.ReadLine());
                        break;
                    case 4:
                        Console.Write("Enter consignment Number to search: ");
                        parameters.Add("consignmentNumber", Console.ReadLine());
                        break;
                    case 5:
                        parameters = PrintCreateConsignmentOptions();
                        break;
                    case 6:
                        Console.Write("Enter consignmentNumber: ");
                        parameters.Add("consignmentNumber", Console.ReadLine());
                        Console.Write("Enter Program Name: ");
                        parameters.Add("program", Console.ReadLine());
                        break;
                }
                
                var response = context.Execute(parameters);
                context.Print(JToken.Parse(response));

                Console.WriteLine($"{Environment.NewLine}{Environment.NewLine}{Environment.NewLine}");
                Console.Write("Press enter to go back to Menu : ");
                Console.ReadLine();
            } while (mainMenuSelection < MenuOptions.Count);
        }

        private static int PrintMainMenu()
        {
            int optionSelected;
           
            do
            {
                Console.Clear();
                Console.WriteLine($"{">".PadLeft(20, '-')} Main Menu {"<".PadRight(20, '-')}{Environment.NewLine}");
                Console.WriteLine("* Press from below options to proceed.");
                MenuOptions.Select((value, idx) => new {value, idx}).ToList().ForEach(item =>
                {
                    Console.WriteLine($"{string.Empty.PadLeft(5, ' ')}{item.idx+1}. {item.value}");
                });

                Console.Write("Enter value: ");
            } while (!int.TryParse(Console.ReadLine(), out optionSelected) || optionSelected <= 0 || optionSelected > MenuOptions.Count);
            Console.Clear();
            return optionSelected;
        }

        private static Dictionary<string, string> PrintCreateConsignmentOptions()
        {
            string pic;
            string programs;
            string species;
            string picName;
            string town;
            string state;

            do
            {
                Console.Clear();
                Console.Write("Enter the Species: ");
                species = Console.ReadLine();

                Console.Write("Enter destination PIC number: ");
                pic = Console.ReadLine();

                Console.Write("Enter destination PIC Name: ");
                picName = Console.ReadLine();

                Console.Write("Enter destination PIC Town: ");
                town = Console.ReadLine();

                Console.Write("Enter destination PIC State: ");
                state = Console.ReadLine();

                Console.Write("Associate Programs (separate programs with comma(,)): ");
                programs = Console.ReadLine();

            } while (string.IsNullOrWhiteSpace(pic) || string.IsNullOrWhiteSpace(species) ||
                     string.IsNullOrWhiteSpace(programs) || string.IsNullOrWhiteSpace(picName) ||
                     string.IsNullOrWhiteSpace(town) || string.IsNullOrWhiteSpace(state));

            return new Dictionary<string, string>
            {
                {nameof(pic), pic},
                {nameof(species), species},
                {nameof(programs), programs},
                {nameof(picName), picName},
                {nameof(town), town},
                {nameof(state), state}
            };
        }
    }
}
