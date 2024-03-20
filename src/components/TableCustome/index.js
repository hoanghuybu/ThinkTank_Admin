import { Table, Popover, Whisper, Dropdown, IconButton, Progress } from 'rsuite';
import MoreIcon from '@rsuite/icons/legacy/More';

function TableCustome() {
    function mockUsers(length) {
        // Initialize an array to hold the user objects
        const users = [];

        // Create multiple user objects and push them into the array
        for (let i = 1; i <= length; i++) {
            const user = {
                id: i,
                name: `Archivement name ${i}`,
                firstName: `First${i}`,
                lastName: `Last${i}`,
                avatar: 'https://via.placeholder.com/50x50',
                city: 'New York',
                street: `${i} Street`,
                postcode: '10001',
                email: `user${i}@example.com`,
                phone: '123-456-7890',
                gender: i % 2 === 0 ? 'male' : 'female',
                age: 18 + Math.floor(Math.random() * 40),
                stars: Math.floor(Math.random() * 10000),
                followers: Math.floor(Math.random() * 10000),
                rating: 2 + Math.floor(Math.random() * 3),
                progress: Math.floor(Math.random() * 100),
                amount: Math.floor(Math.random() * 90000) + 1000,
                company: `Company ${i}`,
            };

            // Push the user object into the array
            users.push(user);
        }

        // Return the array of user objects
        return users;
    }
    const { Column, HeaderCell, Cell } = Table;
    const data = mockUsers(8);

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
                <img src={rowData.avatar} width="40" />
            </div>
        </Cell>
    );

    return (
        <Table height={300} data={data} id="table">
            <Column width={80} align="center">
                <HeaderCell>Icon</HeaderCell>
                <ImageCell dataKey="avartar" />
            </Column>

            <Column width={180}>
                <HeaderCell>Archivement Name</HeaderCell>
                <Cell>{(rowData) => `${rowData.name}`}</Cell>
            </Column>

            <Column width={230}>
                <HeaderCell>Skill Proficiency</HeaderCell>
                <Cell style={{ padding: '10px 0' }}>
                    {(rowData) => <Progress percent={rowData.progress} showInfo={false} />}
                </Cell>
            </Column>

            <Column width={130}>
                <HeaderCell>Rating</HeaderCell>
                <Cell>
                    {(rowData) => Array.from({ length: rowData.rating }).map((_, i) => <span key={i}>⭐️</span>)}
                </Cell>
            </Column>

            <Column width={100}>
                <HeaderCell>Date</HeaderCell>
                <Cell>{(rowData) => `${rowData.amount}`}</Cell>
            </Column>
        </Table>
    );
}

export default TableCustome;
