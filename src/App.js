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
const Input = Input.Group;
const Panel = Collapse.Panel;
const CheckGroup = Checkbox.Group;
const op = Select.Option;

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
		data: "",
		search: "",
		spot: "",
		seen: false,
		currentPic: 0,
		currentFavorite: 0,
		checkedBuildings: [],
	}
// show image data
showData = (index) => {
	if(this.state.current == "favorite"){
		this.setState({
			seen: true,
			currentFavorite: index
		});
	}
	else{
		this.setState({
			seen: true,
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
		seen: false,
		});
	}
handleNo = (e) => {
	this.setState({
		seen: false,
		});
	}
//storing what centers have been chosen by the user
centerStore = checkedValues => {
	this.setState({
		checked	Buildings: checkedValues
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

// selector menu
menuSelect = (e) => {
	this.setState({
		current: e.key,
		});
	}
		
}




export default App;
