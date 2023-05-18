import styled from "@emotion/styled"
import ActionIcon from "../common/ActionIcon"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"

export const AssignmentAlertFooter = () => {
    const Alertfooter = styled.footer`
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10px 14px;
		font-size: 12px;
		font-weight: 700;
		font-family: inherit;
		.menus {
			display: flex;
			align-items: center;
			gap: 5px;
		}
	`
    return (
        <Alertfooter>
            <div className="menus">
                <ActionIcon icon={faInfoCircle} />
                <div>익스텐션이 켜진 상태로 과제 링크에 한번 이상 접속하셔야 파일이 저장됩니다.</div>
            </div>
        </Alertfooter>
    )
}