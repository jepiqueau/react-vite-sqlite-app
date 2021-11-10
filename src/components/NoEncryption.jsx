import React, { useState, useEffect, useRef } from 'react';
import './NoEncryption.css';
import { sqlite } from '../App';

const NoEncryption = () => {
    const [log, setLog] = useState([]);
    const errMess = useRef("");
    useEffect( () => {
        const testDatabaseNoEncryption = async ()  => {
            setLog((log) => log.concat("* Starting test *\n"));
            try {
                const db = await sqlite.createConnection("db_reactvite", false, "no-encryption", 1);
                await db.open();
                let res = await db.query("SELECT * FROM test;");
                if(res.values.length > 0) {
                    let dropcmd = "DELETE FROM test;"
                    await db.execute(dropcmd);
                }              
                let sqlcmd = "INSERT INTO test (id,name) VALUES (?,?);";
                let values  = [1, "Butterfly Valve"];
                res = await db.run(sqlcmd,values);
                if(res.changes.changes !== 1 ||
                                res.changes.lastId !== 1) {
                    errMess.current = `Error: Run lastId != 1 `;
                    return false;
                }
                res = await db.query("SELECT * FROM test");
                if(res.values.length !== 1) {
                    errMess.current = `Error: Select values.length != 1`;
                    return false;
                }
                let sqlSet = [{statement: "INSERT INTO test (id,name) VALUES (?,?);",
                values:[
                    [2,"Ball Valve"],
                    [3,"Pipe"],
                  ]
                }];
                res = await db.executeSet(sqlSet);
                if(res.changes.changes !== 2 ||
                    res.changes.lastId !== 3) {
                    errMess.current = `Error: Run lastId != 3 `;
                    return false;
                }
                res = await db.query("SELECT * FROM test");
                if(res.values.length !== 3) {
                    errMess.current = `Error: Select values.length != 3`;
                    return false;
                }

                await sqlite.closeConnection("db_reactvite");
                setLog((log) => log.concat("* Ending test successfully*\n"));
                 return true;  
            } catch (err) {
              setLog((log) => log.concat(`Error: ${err} \n`));
              return false;
            }
          
        };
        if(sqlite.isAvailable) {
            testDatabaseNoEncryption().then(async res => {
                if(res) {    
                    setLog((log) => log
                        .concat("\n* The set of tests was successful *\n"));
                } else {
                    setLog((log) => log
                        .concat("\n* The set of tests failed *\n"));
                }
            });
        } else {
            sqlite.getPlatform().then((ret)  =>  {
                setLog((log) => log.concat("\n* Not available for " + 
                                    ret.platform + " platform *\n"));
            });         
        }
         
    }, [errMess]);   


    return (
        <div className="container-noencryption">
            <pre>
                <p>{log}</p>
            </pre>
            {errMess.current.length > 0 && <p>{errMess.current}</p>}
        </div>
    );
};
export default NoEncryption;
