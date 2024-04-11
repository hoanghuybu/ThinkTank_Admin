import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination, Button, Input, InputGroup, Stack, DOMHelper, Modal, Panel, PanelGroup } from 'rsuite';

//util
import * as playerManagementService from '~/service/PlayerManagementService';
import './PlayerManagement.scss';

import SearchIcon from '@rsuite/icons/Search';
import { toast } from 'react-toastify';

const { Column, HeaderCell, Cell } = Table;
const CompactCell = (props) => <Cell {...props} style={{ padding: 6 }} />;
const ImageCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
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
            <img
                alt="user avatar"
                src={rowData.avatar ? rowData.avatar : 'https://via.placeholder.com/40x40'}
                width="40"
            />
        </div>
    </Cell>
);

const { getHeight } = DOMHelper;

function PlayerManagement() {
    const [listPlayers, setListPlayer] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [open, setOpen] = React.useState(false);
    const [blockId, setBlockId] = useState(0);
    const [listReport, setListReport] = useState([]);
    const navigate = useNavigate();

    //API
    const getListPlayers = async () => {
        setLoading(true);
        try {
            const result = await playerManagementService.getListPlayers(null, 1000);
            if (result) {
                setLoading(false);
                setListPlayer(result.results);
            }
        } catch (error) {
            toast.error('Error:' + error);
        }
    };

    const handleBlockPlayer = async () => {
        if (blockId) {
            const result = await playerManagementService.banPlayers(blockId);
            if (result) {
                getListPlayers();
                setOpen(false);
            }
        }
    };

    const hanldeReportPlayer = async (value) => {
        setBlockId(value);
        setOpen(true);
        if (value) {
            const result = await playerManagementService.listReports(value);
            setListReport(result.results);
        }
    };

    // handle funtion table

    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    const handleChangeLimit = (dataKey) => {
        setPage(1);
        setLimit(dataKey);
    };

    const getFilteredData = () => {
        let sortedData = listPlayers;
        if (sortedData) {
            sortedData = sortedData.filter((item) => {
                if (!item.fullName.includes(searchKeyword)) {
                    return false;
                }

                return true;
            });
        }
        if (sortColumn && sortType) {
            sortedData = sortedData.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                if (typeof x === 'string') {
                    x = x.charCodeAt();
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt();
                }
                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }

        return sortedData;
    };

    const data = getFilteredData().filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    });

    //handle Modal

    const handleClose = () => setOpen(false);

    useEffect(() => {
        getListPlayers();
    }, []);

    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <Modal overflow size="50rem" open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Report Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PanelGroup>
                            {listReport &&
                                listReport.map((report, index) => (
                                    <Panel key={index} header={report?.userName1}>
                                        <h3>Title Report: {report?.title}</h3>
                                        <h4>Description Report: {report?.description}</h4>
                                    </Panel>
                                ))}
                        </PanelGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose} appearance="subtle">
                            Cancel
                        </Button>
                        <Button onClick={handleBlockPlayer} appearance="primary">
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="w-100 d-flex justify-content-end mt-4 mb-4">
                    <Stack spacing={6}>
                        <InputGroup inside>
                            <Input placeholder="Search by name" value={searchKeyword} onChange={setSearchKeyword} />
                            <InputGroup.Addon>
                                <SearchIcon />
                            </InputGroup.Addon>
                        </InputGroup>
                    </Stack>
                </div>

                <div className="card">
                    <Table
                        height={Math.max(getHeight(window) - 200, 400)}
                        data={data}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                        // virtualized
                    >
                        <Column width={100} align="center" fixed sortable>
                            <HeaderCell>Code</HeaderCell>
                            <Cell dataKey="code" />
                        </Column>

                        <Column width={80} align="center">
                            <HeaderCell>Avatar</HeaderCell>
                            <ImageCell dataKey="avatar" />
                        </Column>

                        <Column width={200} fixed fullText sortable>
                            <HeaderCell>Name</HeaderCell>
                            <CompactCell dataKey="fullName" />
                        </Column>

                        <Column width={100} sortable>
                            <HeaderCell>Gender</HeaderCell>
                            <Cell dataKey="gender" />
                        </Column>
                        <Column width={200} flexGrow={1} fullText sortable>
                            <HeaderCell>Email</HeaderCell>
                            <CompactCell dataKey="email" />
                        </Column>
                        <Column width={50} flexGrow={1} sortable>
                            <HeaderCell>Report Number</HeaderCell>
                            <Cell dataKey="amountReport" />
                        </Column>
                        <Column width={50} flexGrow={1}>
                            <HeaderCell>Status</HeaderCell>
                            <Cell>
                                {(rowData) => (
                                    <span
                                        className={`badge ${
                                            rowData?.status === true ? 'bg-label-success' : 'bg-label-danger'
                                        } me-1`}
                                    >
                                        {rowData?.status === true ? 'Active' : 'InActive'}
                                    </span>
                                )}
                            </Cell>
                        </Column>
                        <Column width={50} flexGrow={1}>
                            <HeaderCell> View Analysis</HeaderCell>
                            <Cell style={{ padding: 6 }}>
                                {(rowData) => (
                                    <Button
                                        color="green"
                                        appearance="primary"
                                        onClick={() => navigate(`/Analysis?playerId=${rowData.id}`)}
                                    >
                                        View
                                    </Button>
                                )}
                            </Cell>
                        </Column>
                        <Column width={50} flexGrow={1}>
                            <HeaderCell> Block Player</HeaderCell>
                            <Cell style={{ padding: 6 }}>
                                {(rowData) => (
                                    <Button
                                        color="red"
                                        appearance="primary"
                                        onClick={() => hanldeReportPlayer(rowData.id)}
                                    >
                                        Block
                                    </Button>
                                )}
                            </Cell>
                        </Column>
                    </Table>
                    <div style={{ padding: 20 }}>
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            maxButtons={5}
                            size="xs"
                            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                            total={listPlayers?.length}
                            limitOptions={[10, 30, 50]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerManagement;
