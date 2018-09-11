

////////////////////////////////////////////////////////////////
////////        discovery query function              ////////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////
const queryString = require('query-string');
const utils = require('../lib/utils');
  /**
   * fetchData - build the query that will be passed to the
   * discovery service.
   */
const fetchData = (query, clearFilters, cb) => {
  const searchQuery = query;
    /*
    var {
      selectedEntities,
      selectedCategories,
      selectedConcepts,
      selectedKeywords,
      selectedEntityTypes,
      queryType,
      returnPassages,
      limitResults,
      sortOrder
    } = this.state;

    // clear filters if this a new text search
    if (clearFilters) {
      selectedEntities.clear();
      selectedCategories.clear();
      selectedConcepts.clear();
      selectedKeywords.clear();
      selectedEntityTypes.clear();
    }
    */

    // build query string, with filters and optional params

    // querytype: (queryType === utils.QUERY_NATURAL_LANGUAGE ?
    //  'natural_language_query' : 'query:'),

    const qs = queryString.stringify({
      query: searchQuery,
      filters: "",
      count: 100,
      sort: '-result_metadata.score',
      returnPassages: "false",
      queryType: 'natural_language_query'
    });

    // send request
    fetch(`/api/search?${qs}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(json => {
        var data = utils.parseData(json);
        var passages = [];

        // note 3rd arg is filterString

        data = utils.formatData(data, passages, ['patrick']);

        console.log('+++ DISCO RESULTS +++');
        // const util = require('util');
        // console.log(util.inspect(data.results, false, null));
        console.log('numMatches: ' + data.results.length);

        // add up totals for the sentiment of reviews
        var totals = utils.getTotals(data);
        data.numPositive = totals.numPositive
        data.numNegative = totals.numNegative
        data.numMatches = data.results.length

        console.log({
          data: data,
          entities: parseEntities(json),
          categories: parseCategories(json),
          concepts: parseConcepts(json),
          keywords: parseKeywords(json),
          entityTypes: parseEntityTypes(json),
          loading: false,
          numMatches: data.results.length,
          numPositive: totals.numPositive,
          numNegative: totals.numNegative,
          numNeutral: totals.numNeutral,
          error: null,
          trendData: null,
          sentimentTerm: utils.SENTIMENT_TERM_ITEM,
          trendTerm: utils.TRENDING_TERM_ITEM
        });
        // REFACTOR
        cb(data)

      })
      .catch(response => {
        /*
        this.setState({
          error: (response.status === 429) ? 'Number of free queries per month exceeded' : 'Error fetching results',
          loading: false,
          data: null
        });
        */
        // eslint-disable-next-line no-console
        console.log("error detected")
        console.error(response);
      });
  }


  const parsePassages = data => ({
    rawResponse: Object.assign({}, data),
    // sentiment: data.aggregations[0].results.reduce((accumulator, result) =>
    //   Object.assign(accumulator, { [result.key]: result.matching_results }), {}),
    results: data.passages
  });

  /**
   * parseEntities - convert raw search results into collection of entities.
   */
  const parseEntities = data => ({
    rawResponse: Object.assign({}, data),
    results: data.aggregations[utils.ENTITY_DATA_INDEX].results
  });

  /**
   * parseCategories - convert raw search results into collection of categories.
   */
  const parseCategories = data => ({
    rawResponse: Object.assign({}, data),
    results: data.aggregations[utils.CATEGORY_DATA_INDEX].results
  });

  /**
   * parseConcepts - convert raw search results into collection of concepts.
   */
  const parseConcepts = data => ({
    rawResponse: Object.assign({}, data),
    results: data.aggregations[utils.CONCEPT_DATA_INDEX].results
  });

  /**
   * parseKeywords - convert raw search results into collection of keywords.
   */
  const parseKeywords = data => ({
    rawResponse: Object.assign({}, data),
    results: data.aggregations[utils.KEYWORD_DATA_INDEX].results
  });

  /**
   * parseEntityTypes - convert raw search results into collection of entity types.
   */
  const parseEntityTypes = data => ({
    rawResponse: Object.assign({}, data),
    results: data.aggregations[utils.ENTITY_TYPE_DATA_INDEX].results
  });

module.exports = {fetchData}
