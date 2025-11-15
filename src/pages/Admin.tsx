import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, LogOut, Trash2, Shield, ShieldOff, Plus, Settings, Users, FileText, MapPin, Home, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableInfoCard from "@/components/SortableInfoCard";
import SortableBottomButton from "@/components/SortableBottomButton";
import SortableTransportCard from "@/components/SortableTransportCard";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'registrations' | 'users' | 'settings'>('registrations');
  const [activeSettingsTab, setActiveSettingsTab] = useState('home');
  const [infoCards, setInfoCards] = useState<any[]>([]);
  const [bottomButtons, setBottomButtons] = useState<any[]>([]);
  const [programCards, setProgramCards] = useState<any[]>([]);
  const [transportCards, setTransportCards] = useState<any[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>(['info_cards', 'description', 'bottom_buttons']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").single();
      if (!roleData) {
        navigate("/");
        return;
      }
      loadRegistrations();
      loadUsers();
      loadSettings();
    } catch (error) {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    const { data } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
    setRegistrations(data || []);
  };

  const loadUsers = async () => {
    const { data: profilesData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const usersWithRoles = await Promise.all((profilesData || []).map(async (profile) => {
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", profile.user_id).eq("role", "admin").maybeSingle();
      return { ...profile, is_admin: !!roleData };
    }));
    setUsers(usersWithRoles);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    setSettings(data || []);
    
    const parseCards = (category: string, prefix: string) => {
      return (data?.filter(s => s.category === category && s.key.startsWith(prefix)) || [])
        .map(s => {
          try {
            return { id: s.id, ...JSON.parse(s.value), order: parseInt(s.description || '0') };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.order - b.order);
    };

    setInfoCards(parseCards('home', 'info_card_'));
    setBottomButtons(parseCards('home', 'bottom_button_'));
    setProgramCards(parseCards('program', 'program_card_'));
    setTransportCards(parseCards('location', 'transport_card_'));
    
    // Load section order
    const orderSetting = data?.find(s => s.category === 'home' && s.key === 'section_order');
    if (orderSetting) {
      try {
        const order = JSON.parse(orderSetting.value);
        setSectionOrder(order);
      } catch {
        setSectionOrder(['info_cards', 'description', 'bottom_buttons']);
      }
    }
  };

  const handleQuickUpdate = async (category: string, key: string, value: string, desc: string) => {
    const existing = settings.find(s => s.category === category && s.key === key);
    if (existing) {
      await supabase.from('site_settings').update({ value }).eq('id', existing.id);
    } else {
      await supabase.from('site_settings').insert({ category, key, value, description: desc });
    }
    toast.success(`${desc}이(가) 저장되었습니다`);
    loadSettings();
  };

  const handleDeleteSetting = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("site_settings").delete().eq("id", id);
    toast.success("삭제 완료");
    loadSettings();
  };

  const handleAddInfoCard = async () => {
    const newCard = { icon: 'Star', title: '새 정보', content: '내용을 입력하세요', order: infoCards.length };
    const { data } = await supabase.from('site_settings').insert({ category: 'home', key: `info_card_${Date.now()}`, value: JSON.stringify(newCard), description: String(newCard.order) }).select().single();
    if (data) {
      setInfoCards([...infoCards, { id: data.id, ...newCard }]);
      toast.success('정보 카드가 추가되었습니다');
    }
  };

  const handleUpdateInfoCard = async (id: string, data: any) => {
    const card = infoCards.find(c => c.id === id);
    if (!card) return;
    const updated = { ...data };
    delete updated.id;
    await supabase.from('site_settings').update({ value: JSON.stringify(updated) }).eq('id', id);
    setInfoCards(infoCards.map(c => c.id === id ? { id: c.id, ...data } : c));
    toast.success('정보 카드가 수정되었습니다');
  };

  const handleDragEndInfoCards = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = infoCards.findIndex(c => c.id === active.id);
    const newIndex = infoCards.findIndex(c => c.id === over.id);
    const reordered = arrayMove(infoCards, oldIndex, newIndex);
    setInfoCards(reordered);
    await Promise.all(reordered.map((card, index) => {
      const cardData = { ...card };
      delete cardData.id;
      return supabase.from('site_settings').update({ value: JSON.stringify(cardData), description: String(index) }).eq('id', card.id);
    }));
    toast.success('정보 카드 순서가 변경되었습니다');
  };

  const handleAddBottomButton = async () => {
    const newButton = { text: '새 버튼', link: '#', variant: 'default', order: bottomButtons.length };
    const { data } = await supabase.from('site_settings').insert({ category: 'home', key: `bottom_button_${Date.now()}`, value: JSON.stringify(newButton), description: String(newButton.order) }).select().single();
    if (data) {
      setBottomButtons([...bottomButtons, { id: data.id, ...newButton }]);
      toast.success('버튼이 추가되었습니다');
    }
  };

  const handleUpdateBottomButton = async (id: string, data: any) => {
    const button = bottomButtons.find(b => b.id === id);
    if (!button) return;
    const updated = { ...data };
    delete updated.id;
    await supabase.from('site_settings').update({ value: JSON.stringify(updated) }).eq('id', id);
    setBottomButtons(bottomButtons.map(b => b.id === id ? { id: b.id, ...data } : b));
    toast.success('버튼이 수정되었습니다');
  };

  const handleDragEndBottomButtons = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = bottomButtons.findIndex(b => b.id === active.id);
    const newIndex = bottomButtons.findIndex(b => b.id === over.id);
    const reordered = arrayMove(bottomButtons, oldIndex, newIndex);
    setBottomButtons(reordered);
    await Promise.all(reordered.map((button, index) => {
      const buttonData = { ...button };
      delete buttonData.id;
      return supabase.from('site_settings').update({ value: JSON.stringify(buttonData), description: String(index) }).eq('id', button.id);
    }));
    toast.success('버튼 순서가 변경되었습니다');
  };

  const handleAddTransportCard = async () => {
    const newCard = { icon: 'Train', title: '새 교통편', description: '설명을 입력하세요', order: transportCards.length };
    const { data } = await supabase.from('site_settings').insert({ category: 'location', key: `transport_card_${Date.now()}`, value: JSON.stringify(newCard), description: String(newCard.order) }).select().single();
    if (data) {
      setTransportCards([...transportCards, { id: data.id, ...newCard }]);
      toast.success('교통편이 추가되었습니다');
    }
  };

  const handleUpdateTransportCard = async (id: string, field: string, value: string) => {
    const card = transportCards.find(c => c.id === id);
    if (!card) return;
    const updated = { ...card, [field]: value };
    delete updated.id;
    await supabase.from('site_settings').update({ value: JSON.stringify(updated) }).eq('id', id);
    setTransportCards(transportCards.map(c => c.id === id ? { ...c, [field]: value } : c));
    toast.success('교통편이 수정되었습니다');
  };

  const handleDragEndTransportCards = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = transportCards.findIndex(c => c.id === active.id);
    const newIndex = transportCards.findIndex(c => c.id === over.id);
    const reordered = arrayMove(transportCards, oldIndex, newIndex);
    setTransportCards(reordered);
    await Promise.all(reordered.map((card, index) => {
      const cardData = { ...card };
      delete cardData.id;
      return supabase.from('site_settings').update({ value: JSON.stringify(cardData), description: String(index) }).eq('id', card.id);
    }));
    toast.success('교통편 순서가 변경되었습니다');
  };

  const handleAddProgramCard = async () => {
    const newCard = { time: '00:00', title: '새 프로그램', description: '설명을 입력하세요', order: programCards.length };
    const { data } = await supabase.from('site_settings').insert({ category: 'program', key: `program_card_${Date.now()}`, value: JSON.stringify(newCard), description: String(newCard.order) }).select().single();
    if (data) {
      setProgramCards([...programCards, { id: data.id, ...newCard }]);
      toast.success('프로그램이 추가되었습니다');
    }
  };

  const handleUpdateProgramCard = async (id: string, field: string, value: string) => {
    const card = programCards.find(c => c.id === id);
    if (!card) return;
    const updated = { ...card, [field]: value };
    delete updated.id;
    await supabase.from('site_settings').update({ value: JSON.stringify(updated) }).eq('id', id);
    setProgramCards(programCards.map(c => c.id === id ? { ...c, [field]: value } : c));
    toast.success('프로그램이 수정되었습니다');
  };

  const handleMoveSectionUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSectionOrder(newOrder);
    await saveSectionOrder(newOrder);
  };

  const handleMoveSectionDown = async (index: number) => {
    if (index === sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setSectionOrder(newOrder);
    await saveSectionOrder(newOrder);
  };

  const saveSectionOrder = async (order: string[]) => {
    const existing = settings.find(s => s.category === 'home' && s.key === 'section_order');
    const value = JSON.stringify(order);
    
    if (existing) {
      await supabase.from('site_settings').update({ value }).eq('id', existing.id);
    } else {
      await supabase.from('site_settings').insert({ category: 'home', key: 'section_order', value, description: '섹션 순서' });
    }
    toast.success('섹션 순서가 변경되었습니다');
    loadSettings();
  };

  const getSectionTitle = (sectionKey: string) => {
    const titles: Record<string, string> = {
      info_cards: '정보 카드',
      description: '행사 소개',
      bottom_buttons: '하단 버튼'
    };
    return titles[sectionKey] || sectionKey;
  };

  const SectionControls = ({ sectionKey, index }: { sectionKey: string; index: number }) => (
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold">{getSectionTitle(sectionKey)}</h3>
      <div className="flex gap-1">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => handleMoveSectionUp(index)}
          disabled={index === 0}
          className="h-6 w-6"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => handleMoveSectionDown(index)}
          disabled={index === sectionOrder.length - 1}
          className="h-6 w-6"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderSection = (sectionKey: string, index: number) => {
    if (sectionKey === 'info_cards') {
      return (
        <div key={sectionKey} className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionControls sectionKey={sectionKey} index={index} />
            <Button onClick={handleAddInfoCard} size="sm"><Plus className="w-4 h-4 mr-2" />카드 추가</Button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndInfoCards}>
            <SortableContext items={infoCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {infoCards.map((card) => <SortableInfoCard key={card.id} id={card.id} card={card} cardData={card} onUpdate={handleUpdateInfoCard} onDelete={() => handleDeleteSetting(card.id)} />)}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      );
    }
    
    if (sectionKey === 'description') {
      return (
        <div key={sectionKey} className="space-y-4">
          <SectionControls sectionKey={sectionKey} index={index} />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input placeholder="행사 소개" defaultValue={settings.find(s => s.key === 'description_title')?.value || ''} onBlur={(e) => handleQuickUpdate('home', 'description_title', e.target.value, '설명 제목')} />
            </div>
            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea placeholder="행사 설명" defaultValue={settings.find(s => s.key === 'description_content')?.value || ''} onBlur={(e) => handleQuickUpdate('home', 'description_content', e.target.value, '설명 내용')} className="min-h-[120px]" />
            </div>
          </div>
        </div>
      );
    }
    
    if (sectionKey === 'bottom_buttons') {
      return (
        <div key={sectionKey} className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionControls sectionKey={sectionKey} index={index} />
            <Button onClick={handleAddBottomButton} size="sm"><Plus className="w-4 h-4 mr-2" />버튼 추가</Button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndBottomButtons}>
            <SortableContext items={bottomButtons.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {bottomButtons.map((button) => <SortableBottomButton key={button.id} id={button.id} button={button} buttonData={button} onUpdate={handleUpdateBottomButton} onDelete={() => handleDeleteSetting(button.id)} />)}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      );
    }
    
    return null;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-primary-foreground py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">관리자 페이지</h1>
          </div>
          <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }} className="text-primary-foreground hover:bg-primary-foreground/20">
            <LogOut className="w-4 h-4 mr-2" />로그아웃
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="registrations"><FileText className="w-4 h-4 mr-2" />신청 현황</TabsTrigger>
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />회원 관리</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />사이트 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">신청 현황</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>전화번호</TableHead>
                    <TableHead>회사</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell>{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell>{reg.company || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={async () => { if (confirm("삭제하시겠습니까?")) { await supabase.from("registrations").delete().eq("id", reg.id); loadRegistrations(); } }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">회원 관리</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>소속</TableHead>
                    <TableHead>관리자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userProfile) => (
                    <TableRow key={userProfile.id}>
                      <TableCell>{userProfile.name}</TableCell>
                      <TableCell>{userProfile.email}</TableCell>
                      <TableCell>{userProfile.organization}</TableCell>
                      <TableCell>
                        {userProfile.is_admin ? (
                          <Button variant="ghost" size="sm" onClick={async () => { if (confirm("권한 제거?")) { await supabase.from("user_roles").delete().eq("user_id", userProfile.user_id).eq("role", "admin"); loadUsers(); } }}>
                            <ShieldOff className="w-4 h-4 mr-2" />권한 제거
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={async () => { await supabase.from("user_roles").insert({ user_id: userProfile.user_id, role: "admin" }); loadUsers(); }}>
                            <Shield className="w-4 h-4 mr-2" />권한 부여
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="home"><Home className="w-4 h-4 mr-2" />홈 화면</TabsTrigger>
                  <TabsTrigger value="program">프로그램</TabsTrigger>
                  <TabsTrigger value="location"><MapPin className="w-4 h-4 mr-2" />장소</TabsTrigger>
                </TabsList>

                <TabsContent value="home" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">히어로 섹션</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>배지 텍스트</Label>
                        <Input placeholder="2024 컨퍼런스" defaultValue={settings.find(s => s.key === 'hero_badge')?.value || ''} onBlur={(e) => handleQuickUpdate('home', 'hero_badge', e.target.value, '배지 텍스트')} />
                      </div>
                      <div className="space-y-2">
                        <Label>제목</Label>
                        <Input placeholder="환영합니다" defaultValue={settings.find(s => s.key === 'hero_title')?.value || ''} onBlur={(e) => handleQuickUpdate('home', 'hero_title', e.target.value, '제목')} />
                      </div>
                      <div className="space-y-2">
                        <Label>부제목</Label>
                        <Textarea placeholder="부제목" defaultValue={settings.find(s => s.key === 'hero_subtitle')?.value || ''} onBlur={(e) => handleQuickUpdate('home', 'hero_subtitle', e.target.value, '부제목')} />
                      </div>
                      <div className="space-y-2">
                        <Label>버튼 텍스트</Label>
                        <Input placeholder="참가 신청하기" defaultValue={settings.find(s => s.key === 'hero_button_text')?.value || ''} onBlur={(e) => handleQuickUpdate('home', 'hero_button_text', e.target.value, '버튼 텍스트')} />
                      </div>
                    </div>
                  </div>

                  {sectionOrder.map((sectionKey, index) => renderSection(sectionKey, index))}
                </TabsContent>

                <TabsContent value="program" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">페이지 정보</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>페이지 제목</Label>
                        <Input placeholder="프로그램" defaultValue={settings.find(s => s.key === 'program_page_title')?.value || ''} onBlur={(e) => handleQuickUpdate('program', 'program_page_title', e.target.value, '페이지 제목')} />
                      </div>
                      <div className="space-y-2">
                        <Label>페이지 설명</Label>
                        <Input placeholder="행사 일정 안내" defaultValue={settings.find(s => s.key === 'program_page_description')?.value || ''} onBlur={(e) => handleQuickUpdate('program', 'program_page_description', e.target.value, '페이지 설명')} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">프로그램 카드</h3>
                      <Button onClick={handleAddProgramCard} size="sm"><Plus className="w-4 h-4 mr-2" />프로그램 추가</Button>
                    </div>
                    <div className="space-y-3">
                      {programCards.map((card) => (
                        <div key={card.id} className="bg-muted rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-3 flex-1">
                              <div className="space-y-2">
                                <Label className="text-sm">시작 시간</Label>
                                <Input type="time" value={card.time} onChange={(e) => handleUpdateProgramCard(card.id, 'time', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">제목</Label>
                                <Input value={card.title} onChange={(e) => handleUpdateProgramCard(card.id, 'title', e.target.value)} placeholder="프로그램 제목" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm">설명</Label>
                                <Textarea value={card.description} onChange={(e) => handleUpdateProgramCard(card.id, 'description', e.target.value)} placeholder="프로그램 설명" />
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSetting(card.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">페이지 정보</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>페이지 제목</Label>
                        <Input placeholder="오시는 길" defaultValue={settings.find(s => s.key === 'location_page_title')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_page_title', e.target.value, '페이지 제목')} />
                      </div>
                      <div className="space-y-2">
                        <Label>페이지 설명</Label>
                        <Input placeholder="행사 장소 안내" defaultValue={settings.find(s => s.key === 'location_page_description')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_page_description', e.target.value, '페이지 설명')} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">주소 정보</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>장소명</Label>
                        <Input placeholder="서울 컨벤션 센터" defaultValue={settings.find(s => s.key === 'location_name')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_name', e.target.value, '장소명')} />
                      </div>
                      <div className="space-y-2">
                        <Label>주소</Label>
                        <Input placeholder="서울특별시 강남구 테헤란로 123" defaultValue={settings.find(s => s.key === 'location_address')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_address', e.target.value, '주소')} />
                      </div>
                      <div className="space-y-2">
                        <Label>지도 URL</Label>
                        <Input placeholder="https://map.kakao.com" defaultValue={settings.find(s => s.key === 'location_map_url')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_map_url', e.target.value, '지도 URL')} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">교통 안내</h3>
                      <Button onClick={handleAddTransportCard} size="sm"><Plus className="w-4 h-4 mr-2" />교통편 추가</Button>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndTransportCards}>
                      <SortableContext items={transportCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {transportCards.map((card) => <SortableTransportCard key={card.id} card={card} onUpdate={handleUpdateTransportCard} onDelete={() => handleDeleteSetting(card.id)} />)}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">문의 정보</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>전화번호</Label>
                        <Input placeholder="02-1234-5678" defaultValue={settings.find(s => s.key === 'location_phone')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_phone', e.target.value, '전화번호')} />
                      </div>
                      <div className="space-y-2">
                        <Label>이메일</Label>
                        <Input placeholder="contact@conference.com" defaultValue={settings.find(s => s.key === 'location_email')?.value || ''} onBlur={(e) => handleQuickUpdate('location', 'location_email', e.target.value, '이메일')} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
