import React, { useState, useEffect } from 'react';
import { Table, Progress } from 'rsuite';
import './TableCustom.scss';

function TableCustome({ data }) {
    const { Column, HeaderCell, Cell } = Table;
    const [dataArchivement, setDataArchivement] = useState([]);

    useEffect(() => {
        if (data) {
            const newData = data.map((item) => {
                const completedLevel = item.completedLevel !== null ? item.completedLevel : 0;
                const percent = (completedLevel / item.completedMilestone) * 100 || 0;

                return {
                    ...item,
                    percent: percent,
                };
            });

            setDataArchivement(newData);
        }
    }, [data]);

    console.log(dataArchivement);

    //sub component
    const ImageCell = ({ rowData, dataKey, ...props }) => (
        <Cell {...props} style={{ padding: 0 }}>
            {rowData.percent === 100 ? (
                <div
                    style={{
                        width: 40,
                        height: 40,
                        background: '#f5f5f5',
                        borderRadius: 6,
                        marginTop: 2,
                        overflow: 'hidden',
                        display: 'inline-block',
                    }}
                >
                    <img className="icon-analysis" src={rowData.avatar} />
                </div>
            ) : (
                <div
                    style={{
                        width: 40,
                        height: 40,
                        background: '#f5f5f5',
                        borderRadius: 6,
                        marginTop: 2,
                        overflow: 'hidden',
                        display: 'inline-block',
                    }}
                >
                    <img className="icon-analysis" src={rowData.missionsImg} style={{ filter: 'grayscale(100%)' }} />
                </div>
            )}
        </Cell>
    );

    return (
        <div>
            {dataArchivement ? (
                <Table height={300} data={dataArchivement} id="table">
                    <Column width={80} align="center">
                        <HeaderCell>Icon</HeaderCell>
                        <ImageCell dataKey="avatar" />
                    </Column>

                    <Column width={180}>
                        <HeaderCell>Archivement Name</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>

                    <Column width={230}>
                        <HeaderCell>Skill Proficiency</HeaderCell>
                        <Cell style={{ padding: '10px 0' }}>
                            {(rowData) => <Progress percent={rowData.percent} showInfo={false} />}
                        </Cell>
                    </Column>

                    <Column width={120}>
                        <HeaderCell>Date</HeaderCell>
                        <Cell dataKey="completedDate" />
                    </Column>
                </Table>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
}

export default TableCustome;
