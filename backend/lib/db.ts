import { supabase } from "./supabase";

// POSTS
export async function createPost(
  userId: string,
  content: string,
  image?: string,
  latitude?: number,
  longitude?: number,
) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      content,
      image,
      latitude,
      longitude,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getFeedPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, users(username, first_name, last_name, profile_image)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getUserPosts(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
}

// GROUPS
export async function createGroup(
  userId: string,
  name: string,
  description: string,
  visibility: string,
) {
  const { data, error } = await supabase
    .from("groups")
    .insert({
      created_by: userId,
      name,
      description,
      visibility,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getGroups() {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function joinGroup(userId: string, groupId: string) {
  const { error } = await supabase.from("group_members").insert({
    user_id: userId,
    group_id: groupId,
  });
  if (error) throw error;
}

export async function leaveGroup(userId: string, groupId: string) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId);
  if (error) throw error;
}

// EVENTS
export async function createEvent(
  userId: string,
  name: string,
  description: string,
  location: string,
  date: string,
) {
  const { data, error } = await supabase
    .from("events")
    .insert({
      created_by: userId,
      name,
      description,
      location,
      date,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*, users(username, first_name, last_name)")
    .order("date", { ascending: true });
  if (error) throw error;
  return data;
}

// FOLLOWERS
export async function followUser(followerId: string, followingId: string) {
  const { error } = await supabase.from("followers").insert({
    follower_id: followerId,
    following_id: followingId,
  });
  if (error) throw error;
}

export async function unfollowUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
}
