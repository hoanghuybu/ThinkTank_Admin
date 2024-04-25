import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination, Button, Input, InputGroup, Stack, Modal, Panel, PanelGroup, SelectPicker } from 'rsuite';

//util
import * as playerManagementService from '~/service/PlayerManagementService';
import './PlayerManagement.scss';

import SearchIcon from '@rsuite/icons/Search';
import { toast } from 'react-toastify';
import { useDebounce } from '~/hooks';

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

const dataFilter = ['Active', 'Inactive'].map((item) => ({ label: item, value: item }));

function PlayerManagement() {
    const [listPlayers, setListPlayer] = useState([]);
    const [listPlayersReported, setListPlayerReported] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);
    const [limitReported, setLimitReported] = useState(10);
    const [pageReported, setPageReported] = useState(1);
    const [loadingReported, setLoadingReported] = useState(false);
    const [sortColumnReported, setSortColumnReported] = useState();
    const [sortTypeReported, setSortTypeReported] = useState();
    const [blockLoading, setBlockLoading] = useState(false);
    const [unblockLoading, setUnblockLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [open, setOpen] = React.useState(false);
    const [blockId, setBlockId] = useState(0);
    const [listReport, setListReport] = useState([]);
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    const debounce = useDebounce(searchKeyword, 500);

    //API
    const getListPlayers = async () => {
        setLoading(true);
        setLoadingReported(true);
        try {
            const result = await playerManagementService.getListPlayers(null, 1000);
            if (result) {
                setLoading(false);
                setLoadingReported(false);
                const filteredList = result.results.filter((player) => player.amountReport > 0);
                setListPlayer(result.results);
                setListPlayerReported(filteredList);
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
        }
    };

    const handleBlockPlayer = async () => {
        setBlockLoading(true);
        try {
            if (blockId) {
                const result = await playerManagementService.banPlayers(blockId);
                if (result) {
                    setBlockLoading(false);
                    getListPlayers();
                    setOpen(false);
                }
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
            setBlockLoading(false);
        }
    };

    const handleUnblockPlayer = async (id) => {
        setUnblockLoading(true);
        try {
            if (id) {
                const result = await playerManagementService.banPlayers(id);
                if (result) {
                    setUnblockLoading(false);
                    getListPlayers();
                }
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            if (error.response.data.errors) {
                for (let key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        error.response.data.errors[key].forEach((errorMessage) => {
                            const errorString = `${key}: ${errorMessage}`;
                            toast.error(errorString);
                        });
                    }
                }
            }
            setUnblockLoading(false);
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

                // if (filter === 'Reported' && !item.amountReport > 0) {
                //     return false;
                // }

                if (filter === 'Active' && !item.status === true) {
                    return false;
                }

                if (filter === 'Inactive' && !item.status === false) {
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

    const handleSortColumnReport = (sortColumnReport, sortTypeReport) => {
        setLoadingReported(true);
        setTimeout(() => {
            setLoadingReported(false);
            setSortColumnReported(sortColumnReport);
            setSortTypeReported(sortTypeReport);
        }, 500);
    };

    const handleChangeLimitReported = (dataKey) => {
        setPageReported(1);
        setLimitReported(dataKey);
    };

    const getFilteredDataReported = () => {
        let sortedDataReported = listPlayersReported;
        if (sortedDataReported) {
            sortedDataReported = sortedDataReported.filter((item) => {
                // if (!item.fullName.includes(searchKeyword)) {
                //     return false;
                // }

                // if (filter === 'Reported' && !item.amountReport > 0) {
                //     return false;
                // }

                if (filter === 'Active' && !item.status === true) {
                    return false;
                }

                if (filter === 'Inactive' && !item.status === false) {
                    return false;
                }

                return true;
            });
        }
        if (sortColumnReported && sortTypeReported) {
            sortedDataReported = sortedDataReported.sort((a, b) => {
                let x = a[sortColumnReported];
                let y = b[sortColumnReported];
                if (typeof x === 'string') {
                    x = x.charCodeAt();
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt();
                }
                if (sortTypeReported === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }

        return sortedDataReported;
    };

    const dataReported = getFilteredDataReported().filter((v, i) => {
        const start = limitReported * (pageReported - 1);
        const end = start + limit;
        return i >= start && i < end;
    });

    //handle Modal

    const handleClose = () => setOpen(false);

    //handle debounce search user

    useEffect(() => {
        setSearchKeyword(debounce);
        setPage(1);
    }, [debounce]);

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
                        {blockLoading && (
                            <Button loading disabled appearance="primary">
                                Ok
                            </Button>
                        )}
                        {!blockLoading && (
                            <Button onClick={handleBlockPlayer} appearance="primary">
                                Ok
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
                <div className="w-100 d-flex justify-content-end mt-4 mb-4">
                    <Stack spacing={6}>
                        <SelectPicker
                            label="Filter"
                            data={dataFilter}
                            searchable={false}
                            value={filter}
                            onChange={(e) => {
                                setPage(1);
                                setFilter(e);
                            }}
                            style={{ width: 224 }}
                        />
                        <InputGroup inside>
                            <Input
                                placeholder="Search by player name"
                                value={searchKeyword}
                                onChange={setSearchKeyword}
                            />
                            <InputGroup.Addon>
                                <SearchIcon />
                            </InputGroup.Addon>
                        </InputGroup>
                    </Stack>
                </div>

                <div className="card">
                    <Table
                        height={350}
                        data={data}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                    >
                        <Column width={60} align="center" fixed fullText sortable>
                            <HeaderCell>Id</HeaderCell>
                            <CompactCell dataKey="id" />
                        </Column>
                        <Column width={100} align="center" fixed sortable>
                            <HeaderCell>Code</HeaderCell>
                            <CompactCell dataKey="code" />
                        </Column>

                        <Column width={80} fixed align="center">
                            <HeaderCell>Avatar</HeaderCell>
                            <ImageCell dataKey="avatar" />
                        </Column>

                        <Column width={200} fixed fullText sortable>
                            <HeaderCell>Name</HeaderCell>
                            <CompactCell dataKey="fullName" />
                        </Column>

                        <Column width={100} sortable>
                            <HeaderCell>Gender</HeaderCell>
                            <CompactCell dataKey="gender" />
                        </Column>
                        <Column width={200} flexGrow={1} fullText sortable>
                            <HeaderCell>Email</HeaderCell>
                            <CompactCell dataKey="email" />
                        </Column>
                        <Column width={200} flexGrow={1} sortable>
                            <HeaderCell>Report Number</HeaderCell>
                            <CompactCell dataKey="amountReport" />
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
                                        color={rowData?.status === true ? 'red' : 'orange'}
                                        appearance="primary"
                                        onClick={
                                            rowData?.status === true
                                                ? () => hanldeReportPlayer(rowData.id)
                                                : () => handleUnblockPlayer(rowData.id)
                                        }
                                        loading={unblockLoading}
                                        disabled={unblockLoading}
                                    >
                                        {rowData?.status === true ? 'Block' : 'Unblock'}
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
                            size="md"
                            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                            total={getFilteredData()?.length}
                            limitOptions={[10, 30, 50]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
                        />
                    </div>
                </div>

                <div className="card p-3">
                    <h1 className="fw-bold text-center">Reported Player Table</h1>
                    <Table
                        height={350}
                        data={dataReported}
                        sortColumn={sortColumnReported}
                        sortType={sortTypeReported}
                        onSortColumn={handleSortColumnReport}
                        loading={loadingReported}
                        // virtualized
                    >
                        <Column width={60} align="center" fixed fullText sortable>
                            <HeaderCell>Id</HeaderCell>
                            <CompactCell dataKey="id" />
                        </Column>
                        <Column width={100} align="center" fixed sortable>
                            <HeaderCell>Code</HeaderCell>
                            <CompactCell dataKey="code" />
                        </Column>

                        <Column width={80} fixed align="center">
                            <HeaderCell>Avatar</HeaderCell>
                            <ImageCell dataKey="avatar" />
                        </Column>

                        <Column width={200} fixed fullText sortable>
                            <HeaderCell>Name</HeaderCell>
                            <CompactCell dataKey="fullName" />
                        </Column>

                        <Column width={100} sortable>
                            <HeaderCell>Gender</HeaderCell>
                            <CompactCell dataKey="gender" />
                        </Column>
                        <Column width={200} flexGrow={1} fullText sortable>
                            <HeaderCell>Email</HeaderCell>
                            <CompactCell dataKey="email" />
                        </Column>
                        <Column width={100} flexGrow={1} sortable>
                            <HeaderCell>Report Number</HeaderCell>
                            <CompactCell dataKey="amountReport" />
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
                                        color={rowData?.status === true ? 'red' : 'orange'}
                                        appearance="primary"
                                        onClick={
                                            rowData?.status === true
                                                ? () => hanldeReportPlayer(rowData.id)
                                                : () => handleUnblockPlayer(rowData.id)
                                        }
                                        loading={unblockLoading}
                                        disabled={unblockLoading}
                                    >
                                        {rowData?.status === true ? 'Block' : 'Unblock'}
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
                            size="md"
                            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                            total={getFilteredDataReported()?.length}
                            limitOptions={[10, 30, 50]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimitReported}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerManagement;
