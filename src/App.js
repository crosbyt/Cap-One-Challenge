import React, { Component } from 'react';
import './App.css';
import SearchDisplay from './SearchDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, InputNumber,  Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox, Menu, Icon, List, Select, PageHeader, BackTop, message} from 'antd';
import 'antd/dist/antd.css';
import { Twitter, Facebook, Google } from 'react-social-sharing'
const { Header, Content} = Layout;
const { Meta } = Card;
const InputGroup = Input.Group;
const Search = Input.Search;
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const options = [
  { label: 'All', value: '' },
  { label: 'Jet Propulsion Laboratory (JPL)', value: 'JPL' },
  { label: 'Headquarters (HQ)', value: 'HQ' },
  { label: 'Kennedy Space Center (KSC)', value: 'KSC' },
  { label: 'Goddard Space Flight Center (GSFC)', value: 'GSFC' },
  { label: 'Langley Research Center (LARC)', value: 'LARC' },
  { label: 'Ames Research Center (ARC)', value: 'ARC' },
  { label: 'Marshall Space Flight Center (MSFC)', value: 'MSFC' },
  { label: 'John C. Stennis Space Center (SSC)', value: 'SSC' },
  { label: 'Armstrong Flight Research Center (ARFC)', value: 'ARFC' },
];

const sortOptions = ["Newest First", "Oldest First"]

class App extends Component {
  state = {
      searchData: "",
      search: "",
      location: "",
      visible: false,
      infoVisible: false,
      currentItem: 0,
      currentFav: 0,
      checkedCenters: [],
      filterSort: "",
      dateFeature: false,
      sortedDateData: []
  }

showData = (index) => {
  if(this.state.current == "favorite"){
    this.setState({
      visible: true,
      currentFav: index
    });
  }
  else{
  this.setState({
    visible: true,
    currentItem: index
  });
}
}

//Modal Button Function
handleOk = (e) => {
	console.log("modal type: " + e.target.id)	
   this.setState({
     visible: false,
   });
 }
 
changeSort = value => {
	 this.setState({
		 filterSort: value
		 })
		}

 //Modal Button Function
 handleCancel = (e) => {
   this.setState({
     visible: false,
   });
 }
 
handleInfoOk = (e) => {
   console.log("modal type: " + e.target.id)
    this.setState({
      infoVisible: false,
    });
  }
  
 handleInfoCancel = (e) => {
    this.setState({
      infoVisible: false,
    });
  }

  userInput = e => {
    ls.set(e.target.id, e.target.value)
  };
  	 
 
  onChange = checkedValues => {
    this.setState({
      checkedCenters: checkedValues
    })
  }

  onClick = item => {
    ls.set("search", item)
    this.search()
  }

  //Menu selector
  menuSelect = (e) => {
    this.setState({
      current: e.key,
    });
  }

  //Which center to search for
  searchCenter = center => {
    ls.set("center", center)
  }
  
  searchCenter = option => {
	  ls.set("sort", option)
	  }
  
  sortData = e => {
    var sortArr = [];
    for(var key in this.state.searchData.items) {
	    sortArr.push({key:key,title:this.state.searchData.items[key].data[0].title, date:this.state.searchData.items[key].data[0].date_created});
	    }
    if(this.state.filterSort == "Newest First"){
    sortArr.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
    });
    }
  else if(this.state.filterSort == "Oldest First"){
		sortArr.sort(function(a,b){
		return new Date(b.date) - new Date(a.date);
     	  });
     	 }
		this.setState({
			sortedDateData: sortArr,
			dateFeature: true
		})
	}

	clearSort = e => {
	this.setState({
		dateFeature:false
		})
	}


  //Search function
  search = e => {
    var searchWord = ""
    //API Request
    searchWord = "https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image&year_start=" + ls.get("startYear") + "&year_end=" + ls.get("endYear") + "&center=" + ls.get("center")
    axios.get(searchWord)
    .catch((error) =>{
      console.log("Bad Request")
    })
    .then((res => {
    let data = res.data;
    this.setState({searchData: data.collection})
    }))
    var searchHistory = ls.get("searchHistory")
    searchHistory = JSON.parse(searchHistory)
    searchHistory.push(ls.get("search"))
    ls.set("searchHistory", JSON.stringify(searchHistory))
    ls.set("startYear", "1920")
    ls.set("endYear", "2019")
    ls.set("center", "")
  }
  
  badSearch = e => {
	  message.warning('Search Had No Results! Showing Default.');
	  ls.set("search", "")
	  this.search()
	  }

  //Clears history
  clearSearch = e => {
    var arr = []
    ls.set("searchHistory", JSON.stringify(arr))
    this.setState({})
  }

  addFav = e => {
    if(this.state.searchData != ""){
      var favorites = ls.get("favorites")
      favorites = JSON.parse(favorites)
      favorites.push(this.state.searchData.items[this.state.currentItem])
      ls.set("favorites", JSON.stringify(favorites))
    }
  }

  componentDidMount() {
      var arr = []
    
      if(!ls.get("endYear")){
        ls.set("startYear", "1920")
      }
      if(!ls.get("endYear")){
        ls.set("endYear", "2019")
      }
      if(ls.get("center") == "null" || !ls.get("center")){
        ls.set("center", "")
      }
      if(ls.get("searchHistory") == "null"|| !ls.get("searchHistory")){
        ls.set("searchHistory", JSON.stringify(arr))
      }
      if(ls.get("favorites") == "null" || !ls.get("favorites")){
        ls.set("favorites", JSON.stringify(arr))
      }
      if(!ls.get("search")){
        ls.set("search", "")
      }
      if(!ls.get("location")){
        ls.set("location", "")
      }
      if(!ls.get("sort")){
	      ls.set("sort", "")
	      }
      this.setState({

      })
      
      axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
      .catch((error) =>{
        console.log("Bad Request")
      })
      .then((res => {
      let data = res.data;
      this.setState(
        {
          searchData: data.collection,
        })
      }))
}

  render() {
    var arr = []
    if(this.state.searchData != ""){
	    if(this.state.searchData.metadata.total_hits == 0){
        this.badSearch();
      }

    if(this.state.dateFeature){
	 var photos = this.state.sortedDateData.map((item,index) => {
		 return(
		 <Col span={6} style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft:"1.4%"}}>
		 <Card value = {parseInt(item.key)} hoverable cover={<img src= {this.state.searchData.items[item.key].links[0].href} onClick= {() => this.showData(parseInt(item.key))} height="200" width="200"/>}
		 >
		 <Meta
		 title={this.state.searchData.items[item.key].data[0].title}
		 onClick= {() => this.showData(parseInt(item.key))}
		 />
		 </Card>
		 </Col>
		 )})
		 }
	else{
    var photos = this.state.searchData.items.slice(0, 50).map((item,index) => {
          return(
        <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4", paddingLeft: "1.4%"}}>
        <Card value = {index} hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showData(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {() => this.showData(index)}
        />
        </Card>
        </Col>
      )})
    }
    }
    else{
      var photos = null
    }
    if(this.state.searchData != "" && ls.get("favorites") != JSON.stringify(arr)){
    var favPhotos = JSON.parse(ls.get("favorites")).reverse().map((item,index) => {
      return(
        <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
        <Card  hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showData(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {() => this.showData(index)}
        />
        </Card>
        </Col>
      )
    })
  }
  else{
    var favPhotos = null
  }

    var centers = options.map(option => {
      return(
        <Option value={option.value} onClick= {() => this.searchCenter(option.value)} >{option.label}</Option>
      )}
    )
    var sorts = sortOptions.map(option => {
	    return(
	    <Option value={option} onClick={() => this.searchCenter(option)} >{option}</Option>
	    )
	    })
    if(this.state.current == "favorite"){
      return (
        <div>
        <div style= {{position: 'fixed', width: '100%', zIndex: 1}}>
        <Header>
        <div className="logo" />
        <Menu
          theme="light"
          mode="horizontal"
          style={{ lineHeight: '64px', textAlign: 'center' }}
          onClick={this.menuSelect}
          selectedKeys={[this.state.current]}
        >
        <Menu.Item key="app">
          <Icon type="home" />Home Page
        </Menu.Item>
        <Menu.Item key="favorite">
          <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />Favorite Images
        </Menu.Item>
        </Menu>
        </Header>
        <div style = {{paddingTop: '5%'}}>
        {favPhotos}
        </div>
        {(this.state.searchData != "" && ls.get("favorites") != JSON.stringify(arr))
        ?<Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          title = {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].title}>
          <p> Center: {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].center} </p>
          <p> Date Created: {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].date_created}</p>
          <p> Description: {JSON.parse(ls.get("favorites"))[this.state.currentFav].data[0].description_508}</p>
          <div style= {{textAlign: "center"}}>
          </div>
        </Modal>:
        <div/>
        }
        </div>
      )
    }
    var arr = []
    return (
      <div className="App">
      <BackTop />
      <div style= {{position: 'fixed', width: '100%', zIndex: 1}}>
      <Header style = {{width: '100%'}}>
      <div className="logo" />
      <Menu
        theme="light"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        onClick={this.menuSelect}
        selectedKeys={[this.state.current]}
      >
      <Menu.Item key="app">
        <Icon type="home" />Home Page
      </Menu.Item>
      <Menu.Item key="favorite">
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />Favorite Images
      </Menu.Item>
      </Menu>
      <Search style={{ width: "30%", textAlign: 'center'}} placeholder="Search" id = "search" onPressEnter={e => this.search(e)} onChange={e => this.userInput(e)} />
    </Header>
      </div>
      <div className= "SearchForm" style = {{paddingTop: '8%', zIndex: 2}}>
      <div className= "MoreOptions" style = {{paddingLeft: "35.4%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: "45%"}}>
        <Panel header="More Search Options" key="1">
          <Col>
          <div><strong>Search by Start Year and/or End Year</strong></div>
          <br/>
          <Search style={{ width: "95%"}} type="number"  placeholder="Start Year" id= "startYear" onChange={e => this.userInput(e)}/>
          <Search style={{ width: "95%"}} type="number" placeholder="End Year" id= "endYear" onChange={e => this.userInput(e)}/>
          <div><strong>Search by NASA Centers</strong></div>
          <br/>
          <Select defaultValue="All" style={{ width: "95%"}} options={options} id = "center">
          {centers}
          </Select>
          </Col>
        </Panel>
        <Panel header="Most Recent Searches" key="3">
          <Col>
          </Col>
          {(ls.get("searchHistory") != null)
          ?<List
            header={<div><strong>Click Item to Search</strong></div>}
             size="small"
             dataSource={JSON.parse(ls.get("searchHistory")).reverse().slice(0,5)}
             renderItem={item => (
               <List.Item style = {{cursor: "pointer"}} value = {item}  onClick = {() => this.onClick(item)}>{item}</List.Item>
             )}
           />:
           <div></div>
         }
          <Button  type="secondary" htmlType="submit" onClick = {e => this.clearSearch(e)}> Clear Search History </Button>
        </Panel>
        <Panel header= "Filter Results" key="2">
        <Col>
        <Select defaultValue="None" style={{ width: "95%", paddingBottom: "2%"}} id = "sort" onChange={this.changeSort} >
        {sorts}
        </Select>
        <div style = {{paddingBottom: "2%"}}>
        <Button type="primary" htmlType="submit" onClick = {e => this.sortData(e)} >Update Results</Button>
        </div>
        <Button type="secondary" htmlType="submit" onClick = {e => this.clearSort(e)} >Clear Filters</Button>
        </Col>
        </Panel>
      </Collapse>
      </div>
      <br/>
      <Button type="primary" icon="search" onClick = {e => this.search(e)}> Search </Button>
      </div>
      <div className = "picGrid">
      {photos}
      </div>
      {(this.state.searchData != "" && this.state.searchData != "null" && this.state.nasaData.metadata.total_hits != 0)
      ?<Modal
      	id= "visible"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        title = {this.state.searchData.items[this.state.currentItem].data[0].title}>
        <p> Center: {this.state.searchData.items[this.state.currentItem].data[0].center} </p>
        <p> Date Created: {this.state.searchData.items[this.state.currentItem].data[0].date_created} </p>
        {(this.state.searchData.items[this.state.currentItem].data[0].photographer != null)
          ?<p> Photogapher: {this.state.searchData.items[this.state.currentItem].data[0].photographer} </p>
          :<div></div>
        }
        {(this.state.searchData.items[this.state.currentItem].data[0].description_508 != null)
        ?<p> Description: {this.state.searchData.items[this.state.currentItem].data[0].description_508} </p>
        :<p>Description: {this.state.searchData.items[this.state.currentItem].data[0].description} </p>
        }
        <div style= {{textAlign: "center"}}>
        <Button icon="heart" onClick = {e => this.addFav(e)}>Add to Favorites</Button>
        <br/>
        <Facebook link={this.state.searchData.items[this.state.currentItem].links[0].href} />
        <Twitter link={this.state.searchData.items[this.state.currentItem].links[0].href} />
        <Google link={this.state.searchData.items[this.state.currentItem].links[0].href} />
        </div>
      </Modal>:
      <div></div>
      }
      <Modal
      id= "infoVisible"
      visible={this.state.infoVisible}
      onOk={this.handleInfoOk}
      onCancel={this.handleInfoCancel}
      >
      </Modal>
    );
  }
}

export default App;