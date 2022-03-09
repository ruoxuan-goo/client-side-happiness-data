import "../App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useState, useEffect } from "react";
import { FormGroup, Form, Badge, Label } from "reactstrap";
import { Bar } from 'react-chartjs-2';

/*fetch /factors*/
function authRequest(year, number, country) {
  const token = localStorage.getItem("token");
  let url = `http://131.181.190.87:3000/factors/${year}`;

  /*check query*/
  if (year && number && country) {
    url += `?limit=${number}&country=${country}`
  } else if (year && number) {
    url += `?limit=${number}`
  } else if (year && country) {
    url += `?country=${country}`
  } else { }

  return fetch(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    var data = res.json()
    return data;
  })
    .then((factors) =>
      factors.map((factor) => {
        return {
          rank: factor.rank,
          country: factor.country,
          score: factor.score,
          economy: factor.economy,
          family: factor.family,
          health: factor.health,
          freedom: factor.freedom,
          generosity: factor.generosity,
          trust: factor.trust
        };
      })
    )
}

/*fetch /countries*/
function getCountriesByQuery() {
  const countriesUrl = "http://131.181.190.87:3000/countries";
  return fetch(countriesUrl)
    .then((res) => {
      return res.json()
    })
}

/*mapping data, display loading and catch error*/
export function useFactors(filter, limit, country) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [economy, setEconomy] = useState({});
  const [family, setFamily] = useState({});
  const [health, setHealth] = useState({});
  const [freedom, setFreedom] = useState({});
  const [generosity, setGenerosity] = useState({});
  const [trust, setTrust] = useState({});
  let countrydata = [];
  let economydata = [];
  let familydata = [];
  let healthdata = [];
  let freedomdata = [];
  let generositydata = [];
  let trustdata = [];

  useEffect(() => {
    authRequest(filter, limit, country)
      .then((rowData) => {
        if (filter, limit) {
          /* only graph data when number of bar is <=15 and not single country*/
          if (rowData.length <= 15 && rowData.length > 1) {
            for (const eachObj of rowData) {
              countrydata.push(eachObj.country)
              economydata.push(eachObj.economy)
              familydata.push(eachObj.family)
              healthdata.push(eachObj.health)
              freedomdata.push(eachObj.freedom)
              generositydata.push(eachObj.generosity)
              trustdata.push(eachObj.trust)
            }
            {/* set graph data */ }
            setEconomy({
              labels: countrydata,
              datasets: [
                {
                  label: 'Economy',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: economydata,
                }
              ]
            })
            setFamily({
              labels: countrydata,
              datasets: [
                {
                  label: 'Family',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: familydata,
                }
              ]
            })
            setHealth({
              labels: countrydata,
              datasets: [
                {
                  label: 'Health',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: healthdata,
                }
              ]
            })
            setFreedom({
              labels: countrydata,
              datasets: [
                {
                  label: 'Freedom',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: freedomdata,
                }
              ]
            })
            setGenerosity({
              labels: countrydata,
              datasets: [
                {
                  label: 'Generosity',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: generositydata,
                }
              ]
            })
            setTrust({
              labels: countrydata,
              datasets: [
                {
                  label: 'Trust',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: trustdata,
                }
              ]
            })
          } else {
            setEconomy({});
            setFamily({});
            setHealth({});
            setFreedom({});
            setGenerosity({});
            setTrust({})
          }
        }

        setRowData(rowData);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter, limit, country]);

  return {
    loading: loading,
    rowData: rowData,
    error: error,
    economy,
    family,
    health,
    freedom,
    generosity,
    trust
  };
}

/*Factors App*/
export default function Factors() {
  const [filter, setFilter] = useState("2020");
  const [limit, setLimit] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const { loading, rowData, error, economy, family, health, freedom, generosity, trust } = useFactors(filter, limit, country);

  useEffect(() => {
    getCountriesByQuery().then((countries) => {
      setCountries(countries)
    });
  }, [])

  const columns = [
    { headerName: "Rank", field: "rank", sortable: true },
    { headerName: "Country", field: "country", filter: true, sortable: true },
    { headerName: "Score", field: "score", sortable: true },
    { headerName: "Economy", field: "economy", sortable: true },
    { headerName: "Family", field: "family", sortable: true },
    { headerName: "Health", field: "health", sortable: true },
    { headerName: "Freedom", field: "freedom", sortable: true },
    { headerName: "Generosity", field: "generosity", sortable: true },
    { headerName: "Trust", field: "trust", sortable: true },
  ];

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>
  }

  return (
    <div className="container">
      <h1>Factors</h1>
      <p>View the overall happiness score and the six happiness factors for each country.</p>

      {/* dropdown boxes */}
      <div className="query">
        <Form inline>
          <FormGroup>
            <Label>Select Year:</Label>
            <select className="dropdown"
              name="filter"
              id="filter"
              onChange={(e) => { setFilter(e.target.value) }}>
              <option>2015</option>
              <option>2016</option>
              <option>2017</option>
              <option>2018</option>
              <option>2019</option>
              <option>2020</option>
            </select>
          </FormGroup>
        </Form>

        <Form inline>
          <FormGroup>
            <Label>Select Limit:</Label>
            <select className="dropdown"
              name="filter"
              id="filter"
              onChange={(e) => { setLimit(e.target.value) }}>
              <option></option>
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>25</option>
              <option>30</option>
              <option>35</option>
              <option>40</option>
              <option>45</option>
              <option>50</option>
            </select>
          </FormGroup>
        </Form>

        <Form inline>
          <FormGroup>
            <Label>Select Country:</Label>
            <select className="dropdown"
              name="filter"
              id="filter"
              onChange={(e) => setCountry(e.target.value)}>
              <option></option>
              {countries.map((value, index) => {
                return <option >{value}</option>
              })}
            </select>
          </FormGroup>
        </Form>
      </div>

      <p className="querybadge"><Badge color="success">{rowData.length}</Badge>  results returned!</p>

      {/* ag-grid */}
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "1000px"
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={15}
        />
      </div>

      {/* chart */}
      <div className="chart_container">
        <Bar className='barchart'
          aria-label="Economy Bar Chart"
          role="img"
          data={economy}
          options={{
            responsive: true,
            indexAxis: 'y',
          }} />

        <Bar className='barchart'
          aria-label="Family Bar Chart"
          role="img"
          data={family}
          options={{
            responsive: true,
            indexAxis: 'y',
          }} />

        <Bar className='barchart'
          aria-label="Health Bar Chart"
          role="img"
          data={health}
          options={{
            responsive: true,
            indexAxis: 'y',
          }} />

        <Bar className='barchart'
          aria-label="Freedom Bar Chart"
          role="img"
          data={freedom}
          options={{
            responsive: true,
            indexAxis: 'y',
          }} />

        <Bar className='barchart'
          aria-label="Generosity Bar Chart"
          role="img"
          data={generosity}
          options={{
            responsive: true,
            indexAxis: 'y',
          }} />

        <Bar className='barchart'
          aria-label="Trust Bar Chart"
          role="img"
          data={trust}
          options={{
            responsive: true,
            indexAxis: 'y',
          }} />
      </div>

    </div>
  );
}