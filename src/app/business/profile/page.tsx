"use client";
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useGetBusinessSettingsQuery, useUpdateBusinessSettingsMutation } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadFromStorage } from '@/features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => { dispatch(loadFromStorage()); }, [dispatch]);

  const bizId = user?.business_id ?? '';
  const { data: settings, isLoading } = useGetBusinessSettingsQuery(bizId, { skip: !bizId });
  const [updateSettings, { isLoading: saving }] = useUpdateBusinessSettingsMutation();

  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (settings) {
      setPhone(settings.phone || '');
      setDescription(settings.description || '');
      setCoverUrl(settings.cover_image_url || '');
    }
  }, [settings]);

  const handleSave = async () => {
    if (!bizId) return;
    try {
      await updateSettings({ bizId, body: { phone, description, cover_image_url: coverUrl } }).unwrap();
      alert('Profile saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !user) return <div className="text-white p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Venue Profile</h2>
          <p className="text-zinc-400">Manage how your venue appears to customers.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Public Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Public Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Cover Image URL</label>
              <input type="text" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="input-field" placeholder="https://example.com/restaurant-image.jpg" />
              {coverUrl && (
                <div className="mt-4 w-full h-48 rounded-xl overflow-hidden border border-white/10">
                  <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">About the Venue</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="Tell your story. What makes your venue special?" rows={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
