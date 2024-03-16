import { CCard, CCardBody, CCardTitle, CCardText, CCardImage, CBadge } from '@coreui/react';
import './TopGameCard.scss';
import images from '~/assets/images';

function TopGameCard({ rank, title, description, gameId }) {
    let medalImage;
    if (rank === 1) {
        medalImage = images.medalOne;
    } else if (rank === 2) {
        medalImage = images.medalTwo;
    } else if (rank === 3) {
        medalImage = images.medalThree;
    }
    return (
        <CCard className="dashboard-card">
            <CBadge style={{ '--cui-badge-color': 'red' }} position="top-end" shape="rounded-bottom">
                <img style={{ width: '60px', height: '60px' }} src={medalImage} alt="Medal"></img>
            </CBadge>
            <CCardImage
                top
                src={
                    gameId === 1
                        ? images.Flipcard
                        : gameId === 2
                        ? images.MusicPassword
                        : gameId === 4
                        ? images.ImageWalkThroungh
                        : gameId === 5
                        ? images.FindAnonymous
                        : 'https://www.cdmi.in/courses@2x/2D3D-Game-Design.webp'
                }
                alt={title}
            />
            <CCardBody>
                <CCardTitle>{title}</CCardTitle>
                <CCardText>{description}</CCardText>
            </CCardBody>
        </CCard>
    );
}

export default TopGameCard;
