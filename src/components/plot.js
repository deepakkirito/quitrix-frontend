import {
    Category,
    ChartComponent,
    ColumnSeries,
    Inject,
    LineSeries,
    SeriesCollectionDirective,
    SeriesDirective,
    Tooltip
} from '@syncfusion/ej2-react-charts';
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import socketClient from 'socket.io-client';
import classes from '../styles/plot.module.scss';


const socketUrl = 'quitrix-plot.onrender.com';
const socket = socketClient(socketUrl);
const baseUrl = 'https://quitrix-plot.onrender.com/plot';



function Plot() {

    const [addPlot, setAddPlot] = useState({ sales: '', year: '' });
    const [plotData, setPlotData] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [alert, setAlert] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const alertTag = useRef();

    useEffect(() => {
        alertTag.current.innerText = 'Loading...';
            setAlert(true);
        axios.get(baseUrl).then(response => {
            setAlert(false);
            setPlotData(response.data.data1);
            setGraphData(response.data.data2);
        })
    }, [])

    useEffect(() => {
        if (refresh) {
            axios.get(baseUrl).then(response => {
                setPlotData(response.data.data1);
                setGraphData(response.data.data2);
            })
        }
    }, [refresh])

    plotData && socket.on('broadcast-data', data => {

        let temp1 = plotData.map(u => {
            if (u._id === data._id) {
                return data
            } else {
                return u
            }
        })
        let temp2 = graphData.map(u => {
            if (u._id === data._id) {
                return data
            } else {
                return u
            }
        })
        setPlotData(temp1);
        setGraphData(temp2);
    })

    socket.on('add-broadcast', data => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 2000);
    })


    const plot = () => {
        if (addPlot.sales < 0 && (addPlot.year < 1980 || addPlot.year > 2023)) {
            alertTag.current.innerText = 'Sales value should be greater than 0 & Year value should be between 1980 to 2023';
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 8000);
        } else if ((addPlot.year < 1980 || addPlot.year > 2023)) {
            alertTag.current.innerText = 'Year value should be between 1980 to 2023';
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);

        } else if (addPlot.sales < 0) {
            alertTag.current.innerText = 'Sales value should be greater than 0';
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
        } else {
            axios.post(baseUrl, addPlot).then(response => {
                if (response.data === 'Data Saved') {
                    setRefresh(true);
                    setTimeout(() => {
                        setRefresh(false);
                    }, 2000);
                    setAddPlot({ sales: '', year: '' });
                } else {
                    alertTag.current.innerText = response.data;
                    setAlert(true);
                    setTimeout(() => {
                        setAlert(false);
                    }, 5000);

                }
            });
            setAlert(false);
        }
    };
    const realTimeChange = (id, name, value) => {
        socket.emit('updated-data', { id: id, name: name, value: value });
        socket.on('data-updated', data => {
            let temp1 = plotData.map(u => {
                if (u._id === data._id) {
                    return data
                } else {
                    return u
                }
            })
            let temp2 = graphData.map(u => {
                if (u._id === data._id) {
                    return data
                } else {
                    return u
                }
            })
            setPlotData(temp1);
            setGraphData(temp2);
        })

    }


    const primaryxAxis = { valueType: 'Category' };

    return (
        <div className={classes.Plot}>
            <div className={classes.left}>
                <ChartComponent id="charts" primaryXAxis={primaryxAxis} title='Sales Analysis'>
                    <Inject services={[ColumnSeries, Tooltip, LineSeries, Category]} />
                    <SeriesCollectionDirective>
                        {plotData && <SeriesDirective dataSource={graphData} xName='year' yName='sales' name='Sales' />}
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
            <div className={classes.right}>
                {<div
                    ref={alertTag}
                    className={`${classes.alert} alert alert-danger`}
                    role="alert"
                    style={alert ? { 'display': 'flex' } : { 'display': 'none' }}
                >

                </div>}
                <table>
                    <thead>
                        <tr>
                            <td>{`X-axis (Sales)`}</td>
                            <td>{`Y-axis (Year)`}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onChange={e => setAddPlot({ ...addPlot, [e.target.id]: e.target.value })}>
                            <td><input value={addPlot.sales} type='number' id='sales' min={0}></input></td>
                            <td><input value={addPlot.year} type='number' id='year' min={1980} max={2023}></input></td>
                            <td><button
                                onClick={plot}
                                disabled={addPlot.sales === '' || addPlot.year === ''}
                                style={addPlot.sales === '' || addPlot.year === '' ? { 'cursor': 'not-allowed', 'opacity': '0.5' } : { 'cursor': 'pointer', 'opacity': '1' }}
                            >
                                <img
                                    src='https://img.icons8.com/glyph-neue/64/null/plus-2-math.png'
                                    alt='plot'
                                    title='plot'
                                ></img>
                            </button></td>
                        </tr>
                        {plotData && plotData.map((data, i) => {
                            return (
                                <tr key={i}>
                                    <td><input
                                        type='number'
                                        id={data._id}
                                        name='sales'
                                        value={data.sales}
                                        onChange={e => realTimeChange(e.target.id, e.target.name, e.target.value)}
                                    ></input></td>
                                    <td><input
                                        readOnly
                                        type='number'
                                        id={data._id}
                                        name='year'
                                        value={data.year}
                                        onChange={e => realTimeChange(e.target.id, e.target.name, e.target.value)}
                                    ></input></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}



export default Plot;
