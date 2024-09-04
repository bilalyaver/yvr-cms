import cp from 'child_process';
import ora from 'ora';

const installComponents = () => {
    // Spinner başlat
    const spinner = ora('Installing components...').start();

    try {
        cp.execSync(`npx shadcn@latest add button badge progress card label input toast checkbox dropdown-menu sheet dialog select textarea table switch`, { stdio: 'inherit' });
        spinner.succeed('Components installed successfully'); // İşlem başarılı olursa spinnerı durdur ve başarılı mesajı göster
    } catch (error) {
        spinner.fail('Failed to install components'); // Hata olursa spinnerı durdur ve hata mesajı göster
        console.error(error);
    }
};

export default installComponents;