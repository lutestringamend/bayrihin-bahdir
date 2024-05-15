import React, { useEffect, useRef, useState } from 'react'
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch, faClose
} from "@fortawesome/free-solid-svg-icons";

const SearchTextInput = (props) => {
    const { label, name, value, error, data, defaultOption, searchButton, searchPlaceholder, loading, disabled } = props;
    const timeoutRef = useRef();

    const [searchMode, setSearchMode] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchList, setSearchList] = useState([]);

    useEffect(() => {
        if (!searchMode) {
            setSearchText("");
            setSearchList([]);
        }
    }, [searchMode]);

    useEffect(() => {
        clearTimeout(timeoutRef.current);
        if (searchText === null || searchText === "") {
          setSearchList([]);
          return;
        }
        timeoutRef.current = setTimeout(searchByName, 500);
      }, [searchText]);

      let searchByName = async () => {
        clearTimeout(timeoutRef.current);
        let result = [];
        try {
            for (let d of data) {
                if (
                    d?.name?.toLowerCase().includes(searchText?.toLowerCase())
                  ) {
                    result.push(d);
                  }
            }
        } catch (e) {
            console.error(e);
        }
        setSearchList(result);
      };

    const onChange = (e) => {
        if (!(props?.onChange === undefined || props?.onChange === null)) {
          props?.onChange(e);
        }
      };

  return (
    <div className="d-sm justify-content-between mb-4">
    <label>
      <b>{label}</b>
    </label>
    {loading ? (
      <FadeLoader
      color="#4e73df"
      loading={true}
      size={8}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
    ) : searchMode ? (
         <div className="d-sm-flex mb-4">
         <div className="input-group">
           <input
             type="text"
             className="form-control bg-white"
             placeholder={searchPlaceholder ? searchPlaceholder : "Cari nama"}
             aria-label="Search"
             aria-describedby="basic-addon2"
             onChange={(e) => setSearchText(e.target.value)}
           />
          
         </div>
         <button
                className="d-sm-flex align-items-center btn btn-sm btn-info shadow-sm mx-1"
                onClick={() => setSearchMode(false)
                }
              >
                <FontAwesomeIcon
                  icon={faClose}
                  style={{ marginRight: "0.25rem", color: "white" }}
                />
                Kembali
              </button>
         </div>
    ) : (
        <div className="d-sm-flex align-items-between">
    <select
      name={name}
      value={value ? value : ""}
      disabled={disabled}
      onChange={(e) =>
        onChange(e)
      }
      className={`form-control ${error? "is-invalid" : ""} `}
    >
      <option value="">{defaultOption}</option>
      {data?.length === undefined
        ? null
        : data.map((item, index) => (
            <option key={index} value={item?.objectId}>
              {item?.name}
            </option>
          ))}
    </select>
    {disabled ? null : 
     <button
     className="d-sm-flex align-items-center btn btn-sm btn-info shadow-sm mx-1"
     onClick={() => setSearchMode(true)
     }
   >
     <FontAwesomeIcon
       icon={faSearch}
       style={{ marginRight: "0.25rem", color: "white" }}
     />
     {searchButton ? searchButton : "Cari"}
   </button>
    }
   
    </div>
    )}
    {searchMode && searchText !== "" && searchList?.length > 0 ? (
         <select
         name={name}
         value={value ? value : ""}
         onChange={(e) =>
           onChange(e)
         }
         className={`form-control ${error? "is-invalid" : ""} `}
       >
         <option value="">---Pilih Hasil Pencarian---</option>
         {searchList?.length === undefined
           ? null
           : searchList.map((item, index) => (
               <option key={index} value={item?.objectId}>
                 {item?.name}
               </option>
             ))}
       </select>
    ) : null}
    
    

    <span style={{ color: "red" }}>{error}</span>
  </div>
  )
}

export default SearchTextInput