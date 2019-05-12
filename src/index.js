import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
var DataTable = require('react-data-components').DataTable;
require('react-data-components/css/table-twbs.css');

var columns = [
  { title: 'IFSC', prop: 'ifsc'  },
  { title: 'Address', prop: 'address' },
  { title: 'BankID', prop: 'bank_id' },
  { title: 'Bank Name', prop: 'bank_name'  },
  { title: 'Branch', prop: 'branch' },
  { title: 'City', prop: 'city' },
  { title: 'District', prop: 'district'  },
  { title: 'State', prop: 'state' }
  
];

class City extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'MUMBAI',
            fetchedData: {},
            keys: [],
            bankNames : {}
            
        };
    }

    handleChange= (event) => {
        this.setState({value: event.target.value});
        let city = event.target.value;
        this.fetchdata({city})   
    }
    
    fetchdata = ({city}) => {
      if(!this.state.fetchedData[city]){
        fetch(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`)
        .then((response)=> response.json())
        .then(finalResponse => {
            const data = finalResponse.map(item => {
                return item;
            })
            const finalData = {...this.state.fetchedData};
            finalData[city] = data
            
            this.setState({
                fetchedData: finalData
            }) 

            let bankNames = _.uniqBy(data, 'bank_name' );
            let uniqueBankList = bankNames.map(item => {
              return item.bank_name
            })

            const finalBankList = {...this.state.bankNames};
            finalBankList[city] = uniqueBankList

            this.setState({
              bankNames: finalBankList              
            })
            
        })  
      }   
    }

    componentDidMount(){
      let city = 'MUMBAI';
      this.fetchdata({city})
    }

    render() {

      let city = this.state.value;
      let bankNames =this.state.bankNames[city] || [];
        return (
          <section>
          <form>
              <label>	
              Pick your favorite city:
              <select value={this.state.value} onChange={this.handleChange}>
                  <option value="MUMBAI">MUMBAI</option>
                  <option value="DELHI">DELHI</option>
                  <option value="PUNE">PUNE</option>
                  <option value="JAIPUR">JAIPUR</option>
              </select>
              </label>
          </form>

          <DataTable
            className="container"
            keys="ifsc"
            columns={columns}
            initialData={this.state.fetchedData[city]}
            initialPageLength={5}
            initialSortBy={{ prop: 'ifsc', order: 'descending' }}
            pageLengthOptions={[ 5, 20, 50 ]}
          />

          <ul>
            {bankNames.length > 0 && bankNames.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            }
            
          </ul>

        </section>
        );
    }
}

ReactDOM.render(<City / > , document.getElementById('root'));