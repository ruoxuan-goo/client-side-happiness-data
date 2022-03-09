import "../App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useState, useEffect } from "react";
import { FormGroup, Form, Label } from "reactstrap";
import { Badge } from "reactstrap";

/*fetch /rankings*/
function getRankingsByQuery(year, country) {
  let url = `http://131.181.190.87:3000/rankings`

  if (year && country) {
    url += `?year=${year}&country=${country}`
  } else if (year) {
    url += `?year=${year}`
  } else if (country) {
    url += `?country=${country}`
  } else { }

  return fetch(url)
    .then((res) => res.json())
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

/*fetch /countries*/
function getCountriesByQuery() {
  const countriesUrl = "http://131.181.190.87:3000/countries";
  return fetch(countriesUrl)
    .then((res) => {
      return res.json()
    })
}

/*mapping data, display loading and catch error*/
export function useRankings(filter, country) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRankingsByQuery(filter, country)
      .then((rowData) => { setRowData(rowData); })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter, country]);

  return {
    loading,
    rowData,
    error: error
  };
}

/*Rankings App*/
export default function Rankings() {
  const [filter, setFilter] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const { loading, rowData, error } = useRankings(filter, country);

  useEffect(() => {
    getCountriesByQuery().then((countries) => {
      setCountries(countries)
    });
  }, [])

  const columns = [
    { headerName: "Rank", field: "rank", sortable: true },
    { headerName: "Country", field: "country", filter: true, sortable: true },
    { headerName: "Score", field: "score", sortable: true },
    { headerName: "Year", field: "year", filter: 'agNumberColumnFilter', sortable: true }
  ];

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>
  }

  return (
    <div className="container">
      <h1>Rankings</h1>
      <p>View happiness rankings of different countries. </p>

      {/* dropdown boxes */}
      <div className="query">
        <Form inline>
          <FormGroup>
            <Label>Select Year:</Label>
            <select className="dropdown"
              name="filter"
              id="filter"
              onChange={(e) => { setFilter(e.target.value) }}>
              <option></option>
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
    </div>
  );
}
