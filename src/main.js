
import 'isomorphic-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Matches from './Matches';
import PaginationMenu from './PaginationMenu';
import SearchField from './SearchField';
import TestIntent from './TestIntent';
import TestQuery from './TestQuery';
import TestClassifier from './TestClassifier';
import TestCycle from './TestCycle';
import TestIngest from './TestIngest';
import EntitiesFilter from './EntitiesFilter';
import CategoriesFilter from './CategoriesFilter';
import ConceptsFilter from './ConceptsFilter';
import KeywordsFilter from './KeywordsFilter';
import EntityTypesFilter from './EntityTypesFilter';
import TagCloudRegion from './TagCloudRegion';
import TrendChart from './TrendChart';
import SentimentChart from './SentimentChart';
import { Grid, Dimmer, Button, Menu, Dropdown, Divider, Loader, Accordion, Icon, Header, Statistic } from 'semantic-ui-react';
const utils = require('../lib/utils');

/**
 * Main React object that contains all objects on the web page.
 * This object manages all interaction between child objects as
 * well as making search requests to the discovery service.
 */
class Main extends React.Component {
  constructor(...props) {
    super(...props);
    const {
      // query data
      entities,
      categories,
      concepts,
      keywords,
      entityTypes,
      data,
      numMatches,
      numPositive,
      numNeutral,
      numNegative,
      error,
      // query params
      searchQuery,
      queryType,
      returnPassages,
      limitResults,
      sortOrder,
      // for filters
      selectedEntities,
      selectedCategories,
      selectedConcepts,
      selectedKeywords,
      selectedEntityTypes,
      // matches panel
      currentPage,
      // tag cloud
      tagCloudType,
      // trending chart
      trendData,
      trendError,
      trendTerm,
      // sentiment chart
      sentimentTerm
    } = this.props;

    // change in state fires re-render of components
    this.state = {
      // query data
      entities: entities,
      categories: categories,
      concepts: concepts,
      keywords: keywords,
      entityTypes: entityTypes,
      data: data,   // data should already be formatted
      numMatches: numMatches || 0,
      numPositive: numPositive || 0,
      numNeutral: numNeutral || 0,
      numNegative: numNegative || 0,
      loading: false,
      error: error,
      // query params
      searchQuery: searchQuery || '',
      queryType: queryType || utils.QUERY_NATURAL_LANGUAGE,
      returnPassages: returnPassages || false,
      limitResults: limitResults || false,
      sortOrder: sortOrder || utils.sortKeys[0].sortBy,
      // used by filters
      selectedEntities: selectedEntities || new Set(),
      selectedCategories: selectedCategories || new Set(),
      selectedConcepts: selectedConcepts || new Set(),
      selectedKeywords: selectedKeywords || new Set(),
      selectedEntityTypes: selectedEntityTypes || new Set(),
      // tag cloud
      tagCloudType: tagCloudType || utils.ENTITY_FILTER,
      // trending chart
      trendData: trendData || null,
      trendError: trendError,
      trendTerm: trendTerm || utils.TRENDING_TERM_ITEM,
      trendLoading: false,
      // sentiment chart
      sentimentTerm: sentimentTerm || utils.SENTIMENT_TERM_ITEM,
      // misc panel
      currentPage: currentPage || '1',  // which page of matches are we showing
      activeFilterIndex: 0,             // which filter index is expanded/active
    };
  }

  /**
   * handleAccordionClick - (callback function)
   * User has selected one of the
   * filter boxes to expand and show values for.
   */
  handleAccordionClick(e, titleProps) {
    const { index } = titleProps;
    const { activeFilterIndex } = this.state;
    const newIndex = activeFilterIndex === index ? -1 : index;
    this.setState({ activeFilterIndex: newIndex });
  }

  /**
   * render - return all the home page object to be rendered.
   */
  render() {
    const { loading, data, error, searchQuery,
      entities, categories, concepts, keywords, entityTypes,
      selectedEntities, selectedCategories, selectedConcepts, selectedKeywords, selectedEntityTypes,
      numMatches, numPositive, numNeutral, numNegative,
      tagCloudType, trendData, trendLoading, trendError, trendTerm,
      queryType, returnPassages, limitResults, sortOrder,
      sentimentTerm } = this.state;

    // used for filter accordions
    const { activeFilterIndex } = this.state;

    const stat_items = [
      { key: 'matches', label: 'REVIEWS', value: numMatches },
      { key: 'positive', label: 'POSITIVE', value: numPositive },
      { key: 'neutral', label: 'NEUTRAL', value: numNeutral },
      { key: 'negative', label: 'NEGATIVE', value: numNegative }
    ];

    var filtersOn = false;
    if (selectedEntities.size > 0 ||
      selectedCategories.size > 0 ||
      selectedConcepts.size > 0 ||
      selectedKeywords.size > 0 ||
      selectedEntityTypes.size > 0) {
      filtersOn = true;
    }

    return (
      <Grid celled className='search-grid'>

        {/* Search Field Header */}

        <Grid.Row color={'blue'}>
          <Grid.Column width={16} textAlign='center'>
            <SearchField
              
              CONTEXT={this.props.CONTEXT}
            />
          </Grid.Column>
        </Grid.Row>

        {/* Results Panel */}

        <Grid.Row className='matches-grid-row'>

          {/* Drop-Down Filters */}

          <Grid.Column width={3}>
            {filtersOn ? (
              <Button
                compact
                basic
                color='red'
                content='clear all'
                icon='remove'
               />
            ) : null}
            <Header as='h2' block inverted textAlign='left'>
              <Icon name='filter' />
              <Header.Content>
                Filter
                <Header.Subheader>
                  By List
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.ENTITY_DATA_INDEX}
                index={utils.ENTITY_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Entities
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.ENTITY_DATA_INDEX}>
            
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.CATEGORY_DATA_INDEX}
                index={utils.CATEGORY_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Categories
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.CATEGORY_DATA_INDEX}>
            
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.CONCEPT_DATA_INDEX}
                index={utils.CONCEPT_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Concepts
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.CONCEPT_DATA_INDEX}>
              
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.KEYWORD_DATA_INDEX}
                index={utils.KEYWORD_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Keywords
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.KEYWORD_DATA_INDEX}>
              
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.ENTITY_TYPE_DATA_INDEX}
                index={utils.ENTITY_TYPE_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Entity Types
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.ENTITY_TYPE_DATA_INDEX}>
                
              </Accordion.Content>
            </Accordion>
            <Divider hidden/>
            <Divider/>
            <Divider hidden/>

            {/* Tag Cloud Region */}

            <Grid.Row>
              <TagCloudRegion
                entities={entities}
                categories={categories}
                concepts={concepts}
                keywords={keywords}
                entityTypes={entityTypes}
                tagCloudType={tagCloudType}
               
              />
            </Grid.Row>


          </Grid.Column>

          {/* Results */}

          <Grid.Column width={7}>
            <Grid.Row>
              {loading ? (
                <div className="results">
                  <div className="loader--container">
                    <Dimmer active inverted>
                      <Loader>Loading</Loader>
                    </Dimmer>
                  </div>
                </div>
              ) : data ? (
                <div className="results">
                  <div className="_container _container_large">
                    <div className="row">
                      <div>
                        <Header as='h2' block inverted textAlign='left'>
                          <Icon name='grid layout' />
                          <Header.Content>
                            Matches
                          </Header.Content>
                        </Header>
                        <Statistic.Group
                          size='mini'
                          items={ stat_items }
                        />
                        <Menu compact className="sort-dropdown">
                          <Icon name='sort' size='large' bordered inverted />
                          <Dropdown
                            item
                            onChange={ this.sortOrderChange.bind(this) }
                            value={ sortOrder }
                            options={ utils.sortTypes }
                          />
                        </Menu>
                      </div>
                      <div>
                        {this.getMatches()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="results">
                  <div className="_container _container_large">
                    <div className="row">
                      {JSON.stringify(error)}
                    </div>
                  </div>
                </div>
              ) : null}
            </Grid.Row>
            <Divider clearing hidden/>

            {/* Pagination Menu */}

            <Grid.Row>
             
            </Grid.Row>

            {/* Cycle - Test message and cms integration */}

            <Grid.Row className='zzz'>
              <div className="form-chart">
                <TestCycle />
              </div>
            </Grid.Row>



          </Grid.Column>



          <Grid.Column width={6}>

            {/* Sentiment Chart Region */}

            <Grid.Row className='rrr'>
              <SentimentChart
                entities={entities}
                categories={categories}
                concepts={concepts}
                keywords={keywords}
                entityTypes={entityTypes}
                term={sentimentTerm}
             
              />
            </Grid.Row>

            <Divider hidden/>
            <Divider/>
            <Divider hidden/>

            {/* Trend Chart Region */}

            <Grid.Row className='ttt'>
              <div className="trend-chart">
                <TrendChart
                  trendData={trendData}
                  trendLoading={trendLoading}
                  trendError={trendError}
                  entities={entities}
                  categories={categories}
                  concepts={concepts}
                  keywords={keywords}
                  entityTypes={entityTypes}
                  term={trendTerm}
                
                />
              </div>
            </Grid.Row>

              {/* Classify - Test building classifier real time with content from cms */}

            <Grid.Row className='uuu'>
              <div className="form-chart">
                <TestClassifier />
              </div>
            </Grid.Row>

              {/* Intent - Test NLP */}

            <Grid.Row className='vvv'>
              <div className="form-chart">
                <TestIntent />
              </div>
            </Grid.Row>

            {/* Query - Test retrieving content from Discovery with queries */}

            <Grid.Row className='www'>
              <div className="form-chart">
                <TestQuery />
              </div>
            </Grid.Row>

            {/* Ingest - Test ingesting content from CMS into Discovery */}

            <Grid.Row className='xxx'>
              <div className="form-chart">
                <TestIngest />
              </div>
            </Grid.Row>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

// type check to ensure we are called correctly
Main.propTypes = {
  data: PropTypes.object,
  entities: PropTypes.object,
  categories: PropTypes.object,
  concepts: PropTypes.object,
  keywords: PropTypes.object,
  entityTypes: PropTypes.object,
  searchQuery: PropTypes.string,
  selectedEntities: PropTypes.object,
  selectedCategories: PropTypes.object,
  selectedConcepts: PropTypes.object,
  selectedKeywords: PropTypes.object,
  selectedEntityTypes: PropTypes.object,
  numMatches: PropTypes.number,
  numPositive: PropTypes.number,
  numNeutral: PropTypes.number,
  numNegative: PropTypes.number,
  tagCloudType: PropTypes.string,
  currentPage: PropTypes.string,
  queryType: PropTypes.string,
  returnPassages: PropTypes.bool,
  limitResults: PropTypes.bool,
  sortOrder: PropTypes.string,
  trendData: PropTypes.object,
  trendError: PropTypes.object,
  trendTerm: PropTypes.string,
  sentimentTerm: PropTypes.string,
  error: PropTypes.object,
  CONTEXT: PropTypes.string
};

module.exports = Main;
