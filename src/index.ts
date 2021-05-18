import { TripleCheckBroker } from 'triplecheck-broker';
import { DynamoRepository } from 'triplecheck-repository-dynamodb';

/**
 * @description The Lambda function handler that will run the broker.
 */
export async function handler(event: any) {
  const [request, payload] = await getRequestData(event);
  const repository = DynamoRepository();
  const { responseData, status, headers } = await TripleCheckBroker(request, payload, repository);

  const response = {
    statusCode: status,
    body: JSON.stringify(responseData),
    headers
  };

  return response;
}

/**
 * @description Utility function to get the data we need to run the TripleCheck broker.
 * Expects the full AWS Lambda event object.
 */
async function getRequestData(event: any): Promise<any> {
  const { body, httpMethod, path, queryStringParameters } = event;

  const payload = body && typeof body === 'string' ? JSON.parse(body) : body;

  const search = (() => {
    let _search = '';
    if (queryStringParameters && JSON.stringify(queryStringParameters) !== '{}') {
      _search += Object.keys(queryStringParameters)[0];
      _search += Object.values(queryStringParameters)[0];
    }
    return _search;
  })();

  return [
    {
      method: httpMethod,
      pathname: path || '/',
      search
    },
    payload
  ];
}
