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

const yearPattern = /^(19|20)\d{2}$/

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
      dateFilter: false,
      sort: "",
      sortedDate: []
  }


//opening Modal 
showModal = (index) => {
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

//Function for opening  Info
showInfoModal = (e) => {
  this.setState({
    infoVisible:true
  })
}

handleOk = (e) => {
  console.log("modal type: " + e.target.id)
   this.setState({
     visible: false,
   });
 }

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
    console.log(yearPattern.test( e.target.value))
    ls.set(e.target.id, e.target.value)
  };

  onChange = checkedValues => {
    this.setState({
      checkedCenters: checkedValues
    })
  }

  handleChange = value => {
    this.setState({
      sort: value
    })
  }
  onClick = item => {
    ls.set("search", item)
    this.search()
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    window.scrollTo(0, 0);
  }

  changeCenter = center => {
    ls.set("center", center)
  }

  changeSort = option => {
    ls.set("sort", option)
  }


  sortData = e => {
    var sortArr = [];
    for (var key in this.state.searchData.items) {
        sortArr.push({key:key,title:this.state.searchData.items[key].data[0].title, date:this.state.searchData.items[key].data[0].date_created});
    }
    if(this.state.sort == "Newest First"){
    sortArr.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
    });
    }
    else if(this.state.sort == "Oldest First"){
    sortArr.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
    });
    }
    this.setState({
      sortedDate: sortArr,
      dateFilter:true
    })
  }

  clearSort = e => {
    this.setState({
      dateFilter:false
    })
  }

  search = e => {
    var searchWord = ""
    //API Request
    if(!yearPattern.test(ls.get("startYear"))){
      ls.set("startYear", "1920")
    }
    if(!yearPattern.test(ls.get("endYear"))){
      ls.set("endYear", "2019")
    }
    searchWord = "https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image&year_start=" + ls.get("startYear") + "&year_end=" + ls.get("endYear") + "&center=" + ls.get("center")
    console.log(searchWord)
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
    if(searchHistory[searchHistory.length-1] != ls.get("search")){
      searchHistory.push(ls.get("search"))
    }
    ls.set("searchHistory", JSON.stringify(searchHistory))
    ls.set("startYear", "1920")
    ls.set("endYear", "2019")
    ls.set("center", "")
  }

  badCall = e => {
    var searchHistory = ls.get("searchHistory")
    searchHistory = JSON.parse(searchHistory)
    message.warning('No Results! Showing Default Images.');
    if(searchHistory.length > 1){
      ls.set("search", searchHistory[searchHistory.length-2])
    }
    else(
      ls.set("search","")
    )
    this.search()
  }

  clearSearch = e => {
    var array = []
    ls.set("searchHistory", JSON.stringify(array))
    this.setState({})
  }

  clearFavorites= e => {
    var array = []
    ls.set("favorites", JSON.stringify(array))
    this.setState({})
  }
  addFavorite = e => {
    if(this.state.searchData != ""){
      var favorites = ls.get("favorites")
      favorites = JSON.parse(favorites)
      favorites.push(this.state.searchData.items[this.state.currentItem])
      ls.set("favorites", JSON.stringify(favorites))
    }
  }

  componentDidMount() {
      var array = []
      if(!ls.get("startYear")){
        ls.set("startYear", "1920")
      }
      if(!ls.get("endYear")){
        ls.set("endYear", "2019")
      }
      if(ls.get("center") == "null" || !ls.get("center")){
        ls.set("center", "")
      }
      if(ls.get("searchHistory") == "null"|| !ls.get("searchHistory")){
        ls.set("searchHistory", JSON.stringify(array))
      }
      if(ls.get("favorites") == "null" || !ls.get("favorites")){
        ls.set("favorites", JSON.stringify(array))
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
    var array = []
    if(this.state.searchData != ""){
      console.log(ls.get("searchHistory"))
      if(this.state.searchData.metadata.total_hits == 0){
        this.badCall();
      }
    if(this.state.dateFilter && this.state.searchData.metadata.total_hits != 0){
      var photos = this.state.sortedDate.map((item,index) => {
            return(
          <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
          <Card value = {parseInt(item.key)} hoverable cover={<img src= {this.state.searchData.items[item.key].links[0].href} onClick= {() => this.showModal(parseInt(item.key))} height="200" width="200"/>}
          >
          <Meta
            title={this.state.searchData.items[item.key].data[0].title}
            onClick= {() => this.showModal(parseInt(item.key))}
          />
          </Card>
          </Col>
        )})
    }
    else{
    var photos = this.state.searchData.items.map((item,index) => {
          return(
        <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
        <Card value = {index} hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showModal(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {() => this.showModal(index)}
        />
        </Card>
        </Col>
      )})
    }
    }
    else{
      var photos = null
    }
    if(this.state.searchData != "" && ls.get("favorites") != JSON.stringify(array)){
    var favPhotos = JSON.parse(ls.get("favorites")).reverse().map((item,index) => {
      return(
        <Col span={6}  style={{paddingTop: "1%", paddingRight: "1.4%", paddingLeft: "1.4%"}}>
        <Card  hoverable cover={<img src= {item.links[0].href} onClick= {() => this.showModal(index)} height="200" width="200"/>}
        >
        <Meta
          title={item.data[0].title}
          onClick= {() => this.showModal(index)}
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
        <Option value={option.value} onClick= {() => this.changeCenter(option.value)} >{option.label}</Option>
      )}
    )

    var sorts = sortOptions.map(option => {
      return(
        <Option value={option} onClick= {() => this.changeSort(option)} >{option}</Option>

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
          onClick={this.handleClick}
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
        </div>
        <div style = {{paddingTop: '5%'}}>
        <div style = {{paddingTop: '1%', paddingBottom: '2%', textAlign: 'center'}} >
        { (JSON.parse(ls.get("favorites")).length != 0)
        ?<Button type="secondary" htmlType="submit" onClick = {e => this.clearFavorites(e)}> Clear Favorites</Button>
        :<strong> Images you favorite will be here </strong>
        }
        </div>
        {favPhotos}
        </div>
        {(this.state.searchData != "" && ls.get("favorites") != JSON.stringify(array))
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
          <Facebook link= {this.state.searchData.items[this.state.currentItem].links[0].href} />
          <Twitter link={this.state.searchData.items[this.state.currentItem].links[0].href} />
          <Google link= {this.state.searchData.items[this.state.currentItem].links[0].href} />
          </div>
        </Modal>:
        <div/>
        }
        </div>
      )
    }
    var array = []
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
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
      >
      <Menu.Item key="app">
        <Icon type="home" />Home Page
      </Menu.Item>
      <Menu.Item key="favorite">
        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />Favorite Images
      </Menu.Item>
      </Menu>
      <Search style={{ width: "30%", textAlign: 'center'}}  placeholder="Search" id = "search" onPressEnter={e => this.search(e)} onChange={e => this.userInput(e)} />
    </Header>
      </div>
      <div className= "SearchForm"   style = {{paddingTop: '8%', zIndex: 2}}>
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
            header={<div><strong>Click Item to Search Again</strong></div>}
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
        <Panel header="Sort Results" key="2">
          <Col>
          <Select defaultValue="None" style={{ width: "95%", paddingBottom: "2%"}} id = "sort" onChange={this.handleChange} >
          {sorts}
          </Select>
          <div style = {{paddingBottom: "2%"}}>
          <Button  type="primary" htmlType="submit" onClick = {e => this.sortData(e)} >Update Search</Button>
          </div>
          <Button  type="secondary" htmlType="submit"onClick = {e => this.clearSort(e)} >Clear Options</Button>
          </Col>
        </Panel>
      </Collapse>
      </div>
      <br/>
      <Button  type="primary" htmlType="submit" onClick = {e => this.search(e)}> Search </Button>
      </div>
      <div className = "photoGrid">
      {photos}
      </div>
      {(this.state.searchData != "" && this.state.searchData != "null" && this.state.searchData.metadata.total_hits != 0)
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
        <Button icon="star" onClick = {e => this.addFavorite(e)}>Add to Favorites</Button>
        <br/>
        <Facebook link= {this.state.searchData.items[this.state.currentItem].links[0].href} />
        <Twitter link={this.state.searchData.items[this.state.currentItem].links[0].href} />
        <Google link= {this.state.searchData.items[this.state.currentItem].links[0].href} />
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
      </div>
    );
  }
}

export default App;