import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import AuthorProfile from '@/components/Common/AuthorProfile';
import ReactionContainer from '@/components/Common/ReactionContainer';
import Modal from '@/components/Common/Layout/Modal';
import { deleteFeed, editFeed } from '@/components/Feed/FeedCard/api';
import styles from './FeedCard.module.scss';
import { FeedDetailType } from '../types';

interface FeedCardTypes {
  feedData: FeedDetailType;
  modalVisible?: boolean;
  toggleModal?: Dispatch<SetStateAction<boolean>>;
  hasPadding: boolean;
  forDetails?: boolean;
  onClick?: () => void;
}
interface Edits {
  feedContent: string;
}

const cn = classNames.bind(styles);

/**
 * @param {FeedData} feedData - 서버사이드 렌더링, getServerSideProps에서 getFeedList 요청에서 받아온 데이터입니다.
 * @param {boolean} modalVisible - 상위 컴포넌트의 모달 출력 여부 상태 변수입니다.
 * @param {Dispatch<SetStateAction<boolean>>} toggleModal - 상위 컴포넌트의 모달 출력 상태를 설정하는 세터함수입니다.
 * @param {boolean} hasPadding - 피드 상세와 피드 리스트 패딩 값이 달라 만들었습니다.
 * @param {boolean} hasHover - 피드 상세와 피드 리스트에서의 호버 여부가 달라 만들어줬습니다.
 * @return {JSX.Element} FeedCard - 사용자 프로필, 사용자가 생성한 내용, 감정을 남길수 있는 컴포넌트 포함된 컴포넌트입니다.
 */

export default function FeedCard({
  feedData,
  modalVisible = false,
  toggleModal,
  hasPadding,
  forDetails,
  onClick,
}: FeedCardTypes) {
  const [emojiVisible, setEmojiVisible] = useState<boolean>(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Edits>();

  const {
    id,
    content,
    viewCount,
    commentCount,
    emojiCount,
    createdAt,
    imageUrls,
  } = feedData.feed;

  const onSubmit: SubmitHandler<Edits> = (data) => {
    setIsEdit(false);
    editFeed(id, data, imageUrls);
  };

  return (
    <div
      className={cn(
        'container',
        hasPadding && 'padding',
        forDetails || 'container-hover',
      )}
    >
      <div className={cn('wrapper')}>
        <div
          className={cn('user-content')}
          onClick={onClick}
          // onClick={async () => {
          //   if (!forDetails) {
          //     await router.push(`?feedId=${id}`);
          //     toggleModal && toggleModal(!modalVisible);
          //   }
          // }}
        >
          <div className={cn('profile-content-wrapper')}>
            <AuthorProfile author={feedData.writer} createdAt={createdAt} />
            {isEdit ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  defaultValue={content}
                  className={cn('text')}
                  placeholder="글을 작성해보세요."
                  {...register('feedContent', {
                    required: '게시글을 작성해주세요',
                  })}
                />
                {errors.feedContent && (
                  <span className={cn('error')}>
                    {errors.feedContent.message}
                  </span>
                )}
                <button type="submit">편집완료</button>
              </form>
            ) : (
              <div className={cn('content')}>{content}</div>
            )}
          </div>
          {!!imageUrls?.length && (
            <div className={cn('upload-image-wrapper')}>
              <div className={cn('upload-image')}>
                <Image
                  sizes="(max-width: 768px) 100vw, 33vw"
                  fill
                  style={{ objectFit: 'cover' }}
                  src={`${imageUrls[0]}`}
                  alt="feedImage"
                />
              </div>
              {imageUrls.length > 1 && (
                <span className={cn('extra-stuff')}>
                  + {imageUrls.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
        <ReactionContainer
          emoji={emojiCount}
          commentsCount={commentCount}
          views={viewCount}
          emojiVisible={emojiVisible}
          handleEmojiClick={setEmojiVisible}
          forDetails={forDetails}
        />
        {hasPadding || (
          <div>
            {isEdit ? (
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  console.log('편집 상태 false로 변경');
                }}
              >
                취소하기
              </button>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEdit(true);
                    console.log('편집상태 true로 변경');
                  }}
                >
                  편집하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('삭제하기');
                    deleteFeed(id);
                  }}
                >
                  삭제하기
                </button>
              </div>
            )}
            <Modal
              title="임시모달"
              cssModalSize={cn('')}
              cssComponentDisplay={cn('')}
              modalVisible={moreModalOpen}
              toggleModal={setMoreModalOpen}
            >
              <div>테스트 모달</div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
