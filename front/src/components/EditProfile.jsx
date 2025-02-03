import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

function EditProfile() {
    const imageRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture || '',
        bio: user?.bio || '',
        gender: user?.gender || '',
    });

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
        }
    };

    const selectChangehandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfileHandler = async () => {

        if (!input.bio.trim()) {
            toast.error('Bio is required.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('bio', input.bio);
            formData.append('gender', input.gender);
            if (input.profilePhoto instanceof File) {
                formData.append('profilePhoto', input.profilePhoto);
            }

            const res = await axios.post('http://localhost:5000/api/v1/user/profile/edit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                }
                dispatch(setAuthUser(updatedUserData));
                toast.success(res.data.message);
            }


            navigate(`/profile/${user?._id}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex max-w-2xl mx-auto pl-10">
            <section className="flex flex-col gap-6 w-full my-8">
                <h1 className="font-bold text-xl">Edit Profile</h1>
                <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={user?.profilePicture || 'default-avatar.png'}
                                alt="profile_img"
                                className="object-cover rounded-full"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h1 className="font-bold text-sm text-gray-800">{user?.username || 'Unknown'}</h1>
                            <span className="text-gray-600 text-sm whitespace-nowrap">
                                {user?.bio || 'I am a full stack developer'}
                            </span>
                        </div>
                    </div>
                    <input type="file" className="hidden" ref={imageRef} onChange={fileChangeHandler} />
                    <Button onClick={() => imageRef.current?.click()}>Change Photo</Button>
                </div>

                <div>
                    <h1 className="font-bold text-xl mb-2">Bio</h1>
                    <textarea
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        name="bio"
                        className="focus-visible:ring-transparent w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <h1 className="font-bold mb-2">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangehandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end">
                    {loading ? (
                        <Button className="w-fit" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={editProfileHandler} className="w-fit">
                            Submit
                        </Button>
                    )}
                </div>
            </section>
        </div>
    );
}

export default EditProfile;
