const {
  MessageConsumerPact,
  Matchers,
  asynchronousBodyHandler,
} = require('@pact-foundation/pact');
const path = require('path');
const handler = require('./delivery-service-handler');

describe('message consumer', () => {
  const messagePact = new MessageConsumerPact({
    consumer: 'delivery-service',
    provider: 'user-service',
    dir: path.resolve(
      process.cwd(),
      'recipes',
      'contract',
      'message-queue',
      'pact',
      'pacts'
    ),
    pactfileWriteMode: 'update',
    logLevel: 'info',
  });

  test('should accept a valid created order message', async () => {
    await messagePact
      .expectsToReceive('A user was deleted event')
      .withContent({
        userId: Matchers.like(1),
        userAddress: Matchers.like('Ruth Avenue 28 NY'),
      })
      .withMetadata({
        'content-type': 'application/json',
      })
      .verify(asynchronousBodyHandler(handler));
  });
});
