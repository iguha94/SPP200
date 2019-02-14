import unittest
import requests_mock

from awslambda.utils import add_data_elastic_search, search_data_elastic_search

SEARCH_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search'
DATA_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course'

class TestLambdas(unittest.TestCase):

    def test_add_data_elastic_search_positive_response(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'result' : 'created' }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = add_data_elastic_search(DATA_URL, {'sample_object' : True})
            self.assertEqual(output, True)


    def test_add_data_elastic_search_negative_response(self):
        with requests_mock.Mocker() as mocker:
            content  = {}
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=400)
            output = add_data_elastic_search(DATA_URL, {'sample_object' : True})
            self.assertEqual(output, False)


    def test_search_data_elastic_search_positive_response(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'hits' : { 'total' : 1 } }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_data_elastic_search(SEARCH_URL, {})
            self.assertEqual(output, True)


    def test_search_data_elastic_search_negative_response(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'hits' : { 'total' : 0 } }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_data_elastic_search(SEARCH_URL, {})
            self.assertEqual(output, False)


if __name__ == '__main__':
    unittest.main()