import { useState } from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
  TextField,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete, Save, Close } from '@mui/icons-material';
import commentsService, { IComment } from '../services/commentsService';
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';
import { useUserContext } from '../UserContext';
import { TruncatedParagraph } from './StyledTypography';

const Comment = ({
  comment,
  onDelete,
  onEdit,
}: {
  comment: IComment;
  onDelete: (id: string) => void;
  onEdit: (editedCommnet: IComment) => void;
}) => {
  const { userContext } = useUserContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const isOwner = comment.user._id === userContext?._id;

  const handleSaveEdit = async () => {
    try {
      const editCommentResponse = (await commentsService.updateComment(comment._id, editedContent))
        .response;
      if (editCommentResponse.status === HttpStatusCode.Ok) {
        onEdit(editCommentResponse.data);
        toast.success('Comment updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to edit post');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteClick = () => setIsDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleConfirmDelete = async () => {
    try {
      const deleteCommentResponse = (await commentsService.deleteComment(comment._id)).response;
      if (deleteCommentResponse.status === HttpStatusCode.Ok) {
        toast.success('Comment deleted successfully');
        onDelete(comment._id);
      } else {
        toast.error('Failed to edit post');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ListItem key={comment._id} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={comment.user.username} src={comment.user.profileImage} />
        </ListItemAvatar>

        {isEditing ? (
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              fullWidth
              size="small"
              multiline
            />
            <Box display="flex" gap={1} mt={1}>
              <Button
                onClick={handleSaveEdit}
                startIcon={<Save />}
                variant="contained"
                size="small"
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                startIcon={<Close />}
                variant="outlined"
                size="small"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <ListItemText
            primary={comment.user.username}
            secondary={
              <Typography variant="body2" color="text.secondary">
                <TruncatedParagraph>{comment.content}</TruncatedParagraph>
              </Typography>
            }
          />
        )}

        {!isEditing && isOwner && (
          <Box display="flex">
            <IconButton size="small" onClick={handleEditClick}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDeleteClick}>
              <Delete fontSize="small" color="error" />
            </IconButton>
          </Box>
        )}
      </ListItem>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this comment?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comment;
