import logging

import voyageai

import os
from dotenv import load_dotenv

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VogayeAIEmbeddings:
    """ A class to generate text embeddings using the Voyage AI Embeddings models. """
    # References:
    # - Voyage AI Embeddings models: https://docs.voyageai.com/docs/embeddings
    # - API Key and Python Client: https://docs.voyageai.com/docs/api-key-and-installation#install-voyage-python-package

    def __init__(self, api_key: str):
        """
        Initialize the VogayeAIEmbeddings class.

        Args:
            api_key (str): The Voyage AI API key. If not provided, it will try to get it from the environment variable VOYAGE_API_KEY.
        """
        self.api_key = api_key or os.getenv("VOYAGE_API_KEY")
        self.vo_client = voyageai.Client(api_key=self.api_key)

    def get_embeddings(self, model_id: str, text: str):
        """
        Generate text embedding by using the Voyage AI Embeddings model.

        Args:
            model_id (str): The model ID to use. Only accepts Voyage AI Embeddings models.
            text (str): The text to embed.

        """
        try:
            logger.info(f"Generating embeddings using model: {model_id}")
            result = self.vo_client.embed([text], model=model_id)
            embeddings = result.embeddings[0]
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            embeddings = None

        return embeddings
    