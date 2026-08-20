import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('Exam info board', () => {
  test('renders display page with core sections', () => {
    render(<App />);

    expect(screen.getByText('🌸 考場資訊看板系統')).toBeInTheDocument();
    expect(screen.getByText('📚 現在考試科目')).toBeInTheDocument();
    expect(screen.getByText('🗓️ 考程表')).toBeInTheDocument();
    expect(screen.getByText('👥 考場人數統計')).toBeInTheDocument();
  });

  test('shows statistics validation warning in edit panel', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '⚙️ 編輯' }));
    const totalInput = screen.getByLabelText('全班總人數');
    fireEvent.change(totalInput, { target: { value: '99' } });

    expect(screen.getByText('⚠️ 教室 + 缺席 + 抽離 必須等於全班總人數')).toBeInTheDocument();
  });
});
