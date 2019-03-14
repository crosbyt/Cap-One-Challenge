import React, { Component } from 'react';
import './App.css';
import SearchDisplay from './SearchDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, InputNumber,  Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox, Menu, Icon, List, Select} from 'antd';
import 'antd/dist/antd.css';
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

const sortOptions = ["Newest First", "Oldest First", "Alphabetical"]

class App extends Component {
  state = {
      searchData: "",
      search: "",
      location: "",
      visible: false,
      currentItem: 0,
      currentFav: 0,
      checkedCenters: [],
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
   this.setState({
     visible: false,
   });
 }

 //Modal Button Function
 handleCancel = (e) => {
   this.setState({
     visible: false,
   });
 }

  userInput = e => {
    ls.set(e.target.id, e.target.value)
  };
  
  sortData = e => {
    var sortArr = [];
    for (var key in this.state.nasaData.items) {
        sortArr.push({key:key,date:this.state.searchData.items[key].data[0].date_created});
    }
    sortArr.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
    });
    this.setState({
      sortedDateData: sortArr,
      dateFeature:true
    })
    console.log(sortArr)
  }
 
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
    console.log(this.state.searchData)
    if(this.state.dateFeature){
	 var photos = this.state.sortedDateData.map((item,index) => {
		 return(
		 <Col span={6} style={{paddingTop: 15, paddingRight: 20, paddingLeft:20}}>
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
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
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
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
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
          <Icon type="house" />Home Page
        </Menu.Item>
        <Menu.Item key="favorite">
          <Icon type="star" />Favorite Images
        </Menu.Item>
        </Menu>
      </Header>
        </div>
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
    console.log((this.state.searchData.items))
    return (
      <div className="App">
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
        <Icon type="camera" />Home Page
      </Menu.Item>
      <Menu.Item key="favorite">
        <Icon type="star" />Favorite Images
      </Menu.Item>
      </Menu>
      <Search style={{ width: 400, textAlign: 'center'}} placeholder="Search" id = "search" onPressEnter={e => this.search(e)} onChange={e => this.userInput(e)} />
    </Header>
      </div>
      <div className= "SearchForm" style = {{paddingTop: '8%'}}>
      <div className= "MoreOptions" style = {{paddingLeft: "35.4%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: 400}}>
        <Panel header="More Search Options" key="1">
          <Col>
          <div><strong>Search by Start Year and/or End Year</strong></div>
          <br/>
          <Search style={{ width: 350}} type="number"  placeholder="Start Year" id= "startYear" onChange={e => this.userInput(e)}/>
          <Search style={{ width: 350}} type="number" placeholder="End Year" id= "endYear" onChange={e => this.userInput(e)}/>
          <div><strong>Search by NASA Centers</strong></div>
          <br/>
          <Select defaultValue="All" style={{ width: 300 }} options={options} id = "center">
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
      </Collapse>
      </div>
      <br/>
      <Button  type="primary" htmlType="submit" onClick = {e => this.search(e)}> Submit </Button>
      </div>
      {photos}
      {(this.state.searchData != "" && this.state.searchData != "null")
      ?<Modal
        title="Basic Modal"
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
        <Button icon="star" onClick = {e => this.addFav(e)}>Add to Favorites</Button>
        </div>
      </Modal>:
      <div/>
      }
      </div>
    );
  }
}

export default App;