import React, { Component } from 'react';
import './App.css';
import SearchDisplay from './SearchDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, InputNumber,  Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox, Menu, Icon, List, Select} from 'antd';
import 'antd/dist/antd.css';
const { Header, Content} = Layout;
const { Meta } = Card;
const Search = Input.Search;
const InputGroup = Input.Group;
const Panel = Collapse.Panel;
const CheckGroup = Checkbox.Group;
const Option = Select.Option;

//Different Building centers used for API
const options = [
	{ label: 'All', value: '' },
	{ label: 'Headquarters', value: 'HQ' },
	{ label: 'Langley Research Center (LARC)', value: 'LARC' },
	{ label: 'Jet Propulsion Laboratory (JPL)', value: 'JPL' },
	{ label: 'Kennedy Space Center (KSC)', value: 'KSC' },
	{ label: 'Armstrong Flight Research Center (ARFC)', value: 'ARFC' },
	{ label: 'Ames Research Center (ARC)', value: 'ARC' },
	{ label: 'Goddard Space Flight Center (GSFC)', value: 'GSFC' },
	{ label: 'Marshall Space Flight Center (MSFC)', value: 'MSFC' },
	{ label: 'Glenn Research Center (GRC)', value: 'GRC'},
	{ label: 'John C. Stennis Space Center (SSC)', value: 'SSC' },
];
const sortOps = ["Alphabetical", "newest First", "Oldest First"]

class App extends Component {
	state = {
		searchData: "",
		search: "",
		spot: "",
		visible: false,
		currentPic: 0,
		currentFavorite: 0,
		checkedBuildings: [],
	}
// show image data
showData = (index) => {
	if(this.state.current == "favorite"){
		this.setState({
			visible: true,
			currentFavorite: index
		});
	}
	else{
		this.setState({
			visible: true,
			currentPic: index
			});
		}
	}
//store user input
userInput = e => {
	ls.set(e.target.id, e.target.value)
	};
//Modal button
handleYes = (e) => {
	this.setState({
		visible: false,
		});
	}
handleNo = (e) => {
	this.setState({
		visible: false,
		});
	}
//storing what centers have been chosen by the user
centerStore = checkedValues => {
	this.setState({
		checkedBuildings: checkedValues
		})
	}

//function for list of search history, searches for what is selected (BONUS FUNCTION)
searchHistory = item => {
	ls.set("search", item)
	this.search()
	}
//which center to search
searchCenter = center => {
	ls.set("center", center)
	}

// select menu
menuSelect = (e) => {
	this.setState({
		current: e.key,
		});
	}
	
// search function that requests from NASA API
search = e => {
	var searchWord = ""
	searchWord = "https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image&year-start=" + ls.get("startYear") + "&year_end=" + ls.get("endYear") + "&center=" + ls.get("center")
	axios.get(searchWord)
	.catch((error) => {
		console.log("Bad Request")
	})
	.then((res => {
		let data = res.data;
		this.setState({searchData: data.collection})
		}))
	//adds to search history (BONUS FEATURE)
	var updatedHistory = ls.get("updatedHistory")
	updatedHistory = JSON.parse(updatedHistory)
	updatedHistory.push(ls.get("search"))
	ls.set("updatedHistory", JSON.stringify(updatedHistory))
	ls.set("startYear", "1920")
	ls.set("endYear", "2019")
	ls.set("center", "")
	}

//clear
searchClear = e => {
	var arr = []
	ls.set("updatedHistory", JSON.stringify(arr))
	this.setState({})
	}
	
//add to favorite (BONUS FEATURE WILL ADD LATER)
addFav = e => {
    if(this.state.searchData != ""){
      var favorites = ls.get("favorites")
      favorites = JSON.parse(favorites)
      favorites.push(this.state.searchData.items[this.state.currentPic])
      ls.set("favorites", JSON.stringify(favorites))
    }
  }

componentLoad() {
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
      if(ls.get("updatedHistory") == "null"|| !ls.get("updatedHistory")){
        ls.set("updatedHistory", JSON.stringify(arr))
      }
      if(ls.get("favorites") == "null" || !ls.get("favorites")){
        ls.set("favorites", JSON.stringify(arr))
      }
      if(!ls.get("search")){
        ls.set("search", "")
      }
      if(!ls.get("spot")){
        ls.set("spot", "")
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
		var pics = this.state.searchData.items.slice(0,50).map((item,index) => {
			return(
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
        <Card value = {index} hoverable cover={<img src= {item.links[0].href} searchHistory= {() => this.showData(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          searchHistory= {() => this.showData(index)}
        />
        </Card>
        </Col>
      )})
    }
    else{
	    var pics = null
	    }
	if(this.state.searchData != "" && ls.get("favorites") != JSON.stringify(arr)){
		var favPhotos = JSON.parse(ls.get("favorites")).reverse().map((item,index) => {
      return(
        <Col span={6}  style={{paddingTop: 15, paddingRight: 20, paddingLeft: 20}}>
        <Card  hoverable cover={<img src= {item.links[0].href} searchHistory= {() => this.showData(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          searchHistory = {() => this.showData(index)}
        />
        </Card>
        </Col>
      )
    })
    }
    else{
	    var favPics = null
	}
	
	var centers = options.map(option => {
		return(
		<Option value={option.value} searchHistory= {() => this.searchCenter(option.value)} >{option.label}</Option>
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
          searchHistory={this.menuSelect}
          selectedKeys={[this.state.current]}
        >
        <Menu.Item key="app">
          <Icon type="camera" />Home Page
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
          visible={this.state.visable}
          onOk={this.handleYes}
          onCancel={this.handleNo}
          title = {JSON.parse(ls.get("favorites"))[this.state.currentFavorite].data[0].title}>
          <p> Center: {JSON.parse(ls.get("favorites"))[this.state.currentFavorite].data[0].center} </p>
          <p> Date Created: {JSON.parse(ls.get("favorites"))[this.state.currentFavorite].data[0].date_created}</p>
          <p> Description: {JSON.parse(ls.get("favorites"))[this.state.currentFavorite].data[0].description_508}</p>
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
        searchHistory={this.menuSelect}
        selectedKeys={[this.state.current]}
      >
      <Menu.Item key="app">
        <Icon type="camera" />Home Page
      </Menu.Item>
      <Menu.Item key="favorite">
        <Icon type="star" />Favorite Images
      </Menu.Item>
      </Menu>
      <Search style={{ width: 400, textAlign: 'center'}} placeholder="Search" id = "search" onPressEnter={e => this.search(e)} centerStore={e => this.userInput(e)} />
    </Header>
      </div>
      <div className= "SearchForm" style = {{paddingTop: '8%'}}>
      <div className= "MoreOptions" style = {{paddingLeft: "35.4%", paddingTop: "1%"}}>
      <Collapse  defaultActiveKey={['0']} style={{ width: 400}}>
        <Panel header="More Search Options" key="1">
          <Col>
          <div><strong>Search by Start Year and/or End Year</strong></div>
          <br/>
          <Search style={{ width: 350}} type="number"  placeholder="Start Year" id= "startYear" centerStore={e => this.userInput(e)}/>
          <Search style={{ width: 350}} type="number" placeholder="End Year" id= "endYear" centerStore={e => this.userInput(e)}/>
          <div><strong>Search by NASA Centers</strong></div>
          <br/>
          <Select defaultValue="All" style={{ width: 300 }} options={options} id = "center">
          {centers}
          </Select>
          </Col>
        </Panel>
        <Panel header="Recent Searches" key="3">
          <Col>
          </Col>
          {(ls.get("updatedHistory") != null)
          ?<List
            header={<div><strong>Click Item to Search</strong></div>}
             size="small"
             dataSource={JSON.parse(ls.get("updatedHistory")).reverse().slice(0,5)}
             renderItem={item => (
               <List.Item style = {{cursor: "pointer"}} value = {item}  searchHistory = {() => this.searchHistory(item)}>{item}</List.Item>
             )}
           />:
           <div></div>
         }
          <Button  type="secondary" htmlType="submit" searchHistory = {e => this.searchClear(e)}> Clear History </Button>
        </Panel>
      </Collapse>
      </div>
      <br/>
      <Button  type="primary" htmlType="submit" searchHistory = {e => this.search(e)}> Submit </Button>
      </div>
      {pics}
      {(this.state.searchData != "" && this.state.searchData != "null")
      ?<Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleYes}
        onCancel={this.handleNo}
        title = {this.state.searchData.items[this.state.currentPic].data[0].title}>
        <p> Center: {this.state.searchData.items[this.state.currentPic].data[0].center} </p>
        <p> Date Created: {this.state.searchData.items[this.state.currentPic].data[0].date_created} </p>
        {(this.state.searchData.items[this.state.currentPic].data[0].photographer != null)
          ?<p> Photogapher: {this.state.searchData.items[this.state.currentPic].data[0].photographer} </p>
          :<div></div>
        }
        {(this.state.searchData.items[this.state.currentPic].data[0].description_508 != null)
        ?<p> Description: {this.state.searchData.items[this.state.currentPic].data[0].description_508} </p>
        :<p>Description: {this.state.searchData.items[this.state.currentPic].data[0].description} </p>
        }
        <div style= {{textAlign: "center"}}>
        <Button icon="star" searchHistory = {e => this.addFav(e)}>Add to Favorites</Button>
        </div>
      </Modal>:
      <div/>
      }
      </div>
    );
  }
	
}




export default App;
