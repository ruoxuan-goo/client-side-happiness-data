import "../App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useState, useEffect } from "react";
import { FormGroup, Form, Badge, Label } from "reactstrap";
import { Line } from 'react-chartjs-2';
import { Typeahead } from 'react-bootstrap-typeahead';

/* fetch /countries */
async function getCountriesByQuery() {
  const countriesUrl = "http://131.181.190.87:3000/countries";
  return await fetch(countriesUrl)
    .then((res) => {
      return res.json()
    })
}

/* fetch /rankings */
function getRankingsByQuery(q) {

  let url = `http://131.181.190.87:3000/rankings?country=${q}`

  return fetch(url)
    .then((res) => {
      var data = res.json()
      return data
    })
    .then((rankings) =>
      rankings.map((ranking) => {
        return {
          rank: ranking.rank,
          country: ranking.country,
          score: ranking.score,
          year: ranking.year
        };
      })
    )
}

export function useSearch(search) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({})
  let year = [];
  let rank = [];

  useEffect(() => {
    getRankingsByQuery(search)
      .then((rowData) => {
        /* set chart data */
        if (search) {
          /* don't set chart data when all countries are returned */
          if (rowData.length <= 6) {
            for (const eachObj of rowData) {
              console.log(eachObj.rank);
              year.push(eachObj.year)
              rank.push(eachObj.rank)
            }
            setChartData({
              labels: year.reverse(),
              datasets: [
                {
                  label: 'Rank',
                  backgroundColor: 'rgb(217, 65, 65)',
                  borderColor: 'rgb(217, 65, 65)',
                  data: rank.reverse(),
                }
              ]
            })
          } else (setChartData({}))
        }
        setRowData(rowData);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search]);

  return {
    loading,
    rowData,
    chartData,
    error: error
  };
}

export default function Search() {
  const [search, setSearch] = useState("");
  const { loading, rowData, error, chartData } = useSearch(search);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountriesByQuery().then((countries) => {
      setCountries(countries)
    });
  }, [])

  const columns = [
    { headerName: "Rank", field: "rank", sortable: true },
    { headerName: "Country", field: "country", filter: "agSetColumnFilter", sortable: true },
    { headerName: "Score", field: "score", sortable: true },
    { headerName: "Year", field: "year", filter: "agNumberColumnFilter", sortable: true }
  ];

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>
  }

  return (
    <div className="container">
      <h1>Search</h1>
      <p>Filter the countries the search bar.</p>
      
      <div className="typeahead">
        <FormGroup>
          <Label>Search Country:</Label>
          <Typeahead
            id="basic-example"
            onChange={(e) => {
              setSearch(e)
            }}
            options={countries}
            placeholder="Search for a country..."
            selected={search}
          />
        </FormGroup>
      </div>

      <p className="querybadge"><Badge color="success">{rowData.length}</Badge>  results returned!</p>

      {/* ag-grid */}
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "800px"
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={15}
        />
      </div>

      {/* graph chart */}
      <div className="chart_container">
        <Line className='searchchart'
          data={chartData}
          options={{
            responsive: true
          }} />
      </div>
    </div>
  );
}
