using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Nlis.DotNet.ConsoleApp.Strategy
{
    public abstract class MenuOptionStrategy
    {
        public abstract string Execute(IDictionary<string, string> args);

        public abstract void Print(JToken data);
    }
}
