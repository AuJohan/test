import requests
from bs4 import BeautifulSoup


def scrape_website(url: str) -> str:
    """Fetch a webpage and return its title text.

    Parameters
    ----------
    url: str
        The URL of the webpage to scrape.

    Returns
    -------
    str
        The content of the ``<title>`` tag or an empty string if not found.
    """
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    title = soup.find('title')
    return title.get_text(strip=True) if title else ''
