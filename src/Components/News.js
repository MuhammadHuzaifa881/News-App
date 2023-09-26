import React, { Component } from 'react';
import Newsitem from './Newsitem';
import Spinner from './Spinner';


import PropTypes from 'prop-types';

import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {

  static defaultProps =  
  {
    country : 'in',
    pageSize : 9,
    category : 'general' 

  }

  static propTypes =  
  {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
  }

  articles = [ ]


  capitalizeFirstLetter = (string) => 
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props)
  {
    super(props);
    this.state=
    { 
      articles : this.articles,
      loading : true,
      page : 1,
      totalResults : 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async UpdateNews(PageNo)
  {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ff6b93bbeda6445fb9baef4dd732528d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({articles : parsedData.articles , TotalResults : parsedData.totalResults, loading:false
    })
    this.props.setProgress(100);
  }

  async componentDidMount()
  {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ff6b93bbeda6445fb9baef4dd732528d&page=1&pageSize=${this.props.pageSize}`;
    // this.setState({loading : true})
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // this.setState({articles : parsedData.articles , TotalResults : parsedData.totalResults, loading:false})
    this.UpdateNews();
  }


  HandlePrevClick = async () =>
  
  {
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ff6b93bbeda6445fb9baef4dd732528d&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
    // this.setState({loading : true})
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // this.setState({
    //   page : this.state.page-1,
    //   articles : parsedData.articles,
    //   loading : false
    // })
    this.setState({page : this.state.page - 1 });
    this.UpdateNews();
  }

  HandleNextClick = async  () =>
  {
    if(!(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)))
    {
      // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ff6b93bbeda6445fb9baef4dd732528d&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
      // this.setState({loading : true})
      // let data = await fetch(url);
      // let parsedData = await data.json();
      // this.setState({
      //   page : this.state.page+1,
      //   articles : parsedData.articles,
      //   loading : false
      // })
    this.setState({page : this.state.page + 1 });
    this.UpdateNews();
    }   
  }

  fetchMoreData = async () => 
  {
   this.setState({page : this.state.page + 1})
   const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ff6b93bbeda6445fb9baef4dd732528d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles : this.state.articles.concat(parsedData.articles),
        totalResults : parsedData.totalResults
      })

  };

  render() {
    return (
      <>
        <h1 className='text-center' style={{margin :"35px 0px"}}>News Monkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>} >

          <div className="container">
          <div className="row"> 
              {/* {!this.state.loading && this.state.articles.map((element) => { */}
              {this.state.articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                      <Newsitem  title={element.title?element.title.slice(0,45) : ""} description={element.description?element.description.slice(0,88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                      </div>
            })}

          </div>

          </div>

          </InfiniteScroll>


          {/* <div className="container mt-4 mb-4 d-flex justify-content-between">
              <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.HandlePrevClick}>&larr; Previous</button>
              <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.HandleNextClick}>Next &rarr;</button>
          </div> */}
            
      </>
    )
  }
}

export default News;
