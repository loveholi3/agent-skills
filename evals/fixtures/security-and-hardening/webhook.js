'use strict';

const MAX_PREVIEW_LENGTH = 2048;

async function previewWebhook(url, fetchImpl = fetch) {
  const response = await fetchImpl(url, { redirect: 'follow' });
  return {
    status: response.status,
    body: (await response.text()).slice(0, MAX_PREVIEW_LENGTH),
  };
}

module.exports = { previewWebhook };
