const amocrmService = require('../services/amocrmServices');

exports.handleAmoCrmCallback = async (req, res) => {
  const code = "def50200fa86719f57108eeb66425139550c2ecaf839c945205572d282065b8ee5b69639ce1263bc5c975c941a9cc60d33ce6c19f8db093dd4161d8a7f5700847c641bee7ad515e179c19f0ffc8d89e04bbb2f8f6dbc86c8a805f135245b6cc945de75120b96792ee7330107634e0818bfcbbda947e9a8d7bc39f06e01c53d9738578d67e540d587bae315296d5c059e0b4c6c55f5c844a25f7bbf41ee2be22b010310de0a7cd3b9ba4100df89ed79eb68ab50c35703be23892550c9941c59571ab172fcba14d3c116b86716e06742cb0e89e6e20e87c20d32a8ded81f3c0147ef8e34427fc2ec68d98b15f48107a84b578a65ad0dbc524d39e67b52d2155d8694ac348d90155919ab0dccd5598c79570878199651f6707ae5bacd53892d1e20e8428b9c086601208390d000a2783912be67437c8541bfc9cde7f96f734782127d02be90198eb7bf8ca4603f6254de7d25c138f4ec509eae5dd29f91ae1af60857fc54a3d1d78f8f3ae718b2550b3441ee4fceb73f6a03e62d6c5bd3a83677eedaab7a48bffc429116a53d061ac140aae6374558ae654c5fd03ed7375f5d6d9df1ae3ea1440ed2fc32bf4d61cbe7c994cc3c893217483bbe1d4eb7efca4dbdefa2b6be2ad8ee64d60f447dcf89e9b679f34305f94fe04104f253e892e9f70178c34ed6f0aeb674e9e5c06ea86f217041ac055a9e2b2b2e2ac9c74ffec0bfeba089d22dd7bb1b9337bb";

  if (!code) {
    return res.status(400).json({ message: 'No authorization code provided' });
  }

  console.log('Received Authorization Code:', code)

  try {
    const tokenData = await amocrmService.getAccessToken(code);
    res.json({ message: 'Access token received', tokenData });
  } catch (error) {
    res.status(500).json({ message: 'Error during token exchange', error: error.message });
  }
};
