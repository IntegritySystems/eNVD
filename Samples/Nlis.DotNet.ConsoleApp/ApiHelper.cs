using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Nlis.DotNet.ConsoleApp
{
    public class ApiHelper
    {
        private readonly HttpClient _client;
        public ApiHelper(HttpClient client)
        {
            _client = client;
        }

        public string GetConsignments(string consignmentNumber, bool noDraft = false, uint? pageSize = null, string pageToken = null)
        {
            return GetConsignmentsAsync(consignmentNumber, noDraft, pageSize, pageToken).GetAwaiter().GetResult();
        }

        public async Task<string> GetConsignmentsAsync(string consignmentNumber, bool noDraft = false, uint? pageSize = null, string pageToken = null)
        {
            var queryParams = "";

            if (!string.IsNullOrWhiteSpace(consignmentNumber))
                queryParams += $"{nameof(consignmentNumber)}={consignmentNumber}&";

            if (noDraft)
                queryParams += $"{nameof(noDraft)}=1&";

            if (pageSize.HasValue)
                queryParams += $"{nameof(pageSize)}={pageSize}&";

            if (!string.IsNullOrWhiteSpace(pageToken))
                queryParams += $"{nameof(pageToken)}={pageToken}&";

            if (!string.IsNullOrEmpty(queryParams))
                queryParams = $"?{queryParams.TrimEnd('&')}";

            PrintHttpRequestDetails($"{_client.BaseAddress}{Constants.ConsignmentsApiPath}{queryParams}");
            var response = await _client.GetAsync($"{Constants.ConsignmentsApiPath}{queryParams}");

            return await response.Content.ReadAsStringAsync();
        }

        public string GetConsignmentDetails(string consignmentNumber)
        {
            return GetConsignmentDetailsAsync(consignmentNumber).GetAwaiter().GetResult();
        }
        public async Task<string> GetConsignmentDetailsAsync(string consignmentNumber)
        {
            if(string.IsNullOrWhiteSpace(consignmentNumber))
                throw new ApplicationException($"{nameof(consignmentNumber)} missing");

            PrintHttpRequestDetails($"{_client.BaseAddress}{Constants.ConsignmentsApiPath}/{consignmentNumber}");

            var response = await _client.GetAsync($"{Constants.ConsignmentsApiPath}/{consignmentNumber}");

            return await response.Content.ReadAsStringAsync();
        }

        public string CreateNewConsignment(string species, object payload)
        {
            return CreateNewConsignmentAsync(species, payload).GetAwaiter().GetResult();
        }

        public async Task<string> CreateNewConsignmentAsync(string species, object payload)
        {
            var stringContent = JsonConvert.SerializeObject(payload);
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");

            PrintHttpRequestDetails($"{_client.BaseAddress}{Constants.ConsignmentsApiPath}", stringContent);

            var response = await _client.PostAsync($"{Constants.ConsignmentsApiPath}", httpContent);

            return await response.Content.ReadAsStringAsync();
        }

        public string AddProgramToExistingConsignment(string consignmentNumber, object payload)
        {
            return AddProgramToExistingConsignmentAsync(consignmentNumber, payload).GetAwaiter().GetResult();
        }

        public async Task<string> AddProgramToExistingConsignmentAsync(string consignmentNumber, object payload)
        {
            var stringContent = JsonConvert.SerializeObject(payload);
            var httpContent = new StringContent(stringContent, Encoding.UTF8, "application/json");

            PrintHttpRequestDetails($"{_client.BaseAddress}{Constants.ConsignmentsApiPath}/{consignmentNumber}", stringContent);

            var response = await _client.PutAsync($"{Constants.ConsignmentsApiPath}/{consignmentNumber}", httpContent);

            return await response.Content.ReadAsStringAsync();
        }

        public string GetAvailablePrograms(string species)
        {
            return GetAvailableProgramsAsync(species).GetAwaiter().GetResult();
        }

        public async Task<string> GetAvailableProgramsAsync(string species)
        {
            PrintHttpRequestDetails($"{_client.BaseAddress}{Constants.FormsModelsApiPath}?{nameof(species)}={species}");
            var response = await _client.GetAsync($"{Constants.FormsModelsApiPath}?{nameof(species)}={species}");

            return await response.Content.ReadAsStringAsync();
        }

        private void PrintHttpRequestDetails(string uri, string requestBody = null)
        {
            Console.WriteLine($"Requesting : {Environment.NewLine}{uri}");
            Console.WriteLine("Headers :");
            Console.WriteLine($"{string.Empty.PadLeft(5, ' ')}'Accept': 'application/json'");
            Console.WriteLine($"{string.Empty.PadLeft(5, ' ')}'Authorization': '{_client.DefaultRequestHeaders.Authorization}'{Environment.NewLine}");

            if (string.IsNullOrWhiteSpace(requestBody))
                return;

            Console.WriteLine(Environment.NewLine);
            Console.WriteLine($"Request Body: {requestBody}");

        }
    }
}
